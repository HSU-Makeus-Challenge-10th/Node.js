import { responseFromStoreMission, CreateStoreMissionData } from "../dtos/mission.dtos.js";
import { findStoreById } from "../../stores/repositories/stores.repositories.js";
import { addMission, getMissionById } from "../repositories/mission.repositories.js";
import { findMemberById } from "../../users/repositories/user.repositories.js";
import { responseFromUserMission, StartMissionChallengeData } from "../dtos/mission.dtos.js";
import { findUserMissionByUserIdAndMissionId, getUserMissionById, insertUserMission } from "../repositories/mission.repositories.js";


export const createStoreMission = async (data: CreateStoreMissionData) => {
  if (!Number.isInteger(data.store_id) || data.store_id <= 0) {
    throw new Error("잘못된 가게 id입니다.");
  }

   if (!data.title || data.title.trim().length === 0) {
    throw new Error("미션 제목이 없습니다.");
  }

  if (data.title.trim().length > 40) {
    throw new Error("미션 제목은 40자 이하여야 합니다.");
  }

  if (!Number.isInteger(data.point) || data.point <= 0) {
    throw new Error("미션 포인트는 1 이상의 정수여야 합니다.");
  }

  const expiredDate = new Date(data.expired_date);
  if (Number.isNaN(expiredDate.getTime())) {
    throw new Error("잘못된 만료일자입니다.");
  }

  if (expiredDate <= new Date()) {
    throw new Error("만료일은 과거가 될 수 없습니다.");
  }

  const store = await findStoreById(data.store_id);
  if (!store) {
    throw new Error("존재하지 않는 가게입니다.");
  }

  const missionId = await addMission({
    store_id: data.store_id,
    title: data.title.trim(),
    description: data.description?.trim() ?? "",
    point: data.point,
    expired_date: expiredDate,
  });

  const mission = await getMissionById(missionId);
  if (!mission) {
    throw new Error("미션 저장에 실패하였습니다.");
  }

  return responseFromStoreMission(mission);
}

export const startMissionChallenge = async (data: StartMissionChallengeData) => {
  if (!Number.isInteger(data.mission_id) || data.mission_id <= 0) {
    throw new Error("잘못된 미션 id입니다.");
  }

  if (!Number.isInteger(data.user_id) || data.user_id <= 0) {
    throw new Error("잘못된 사용자 id입니다.");
  }

  const member = await findMemberById(data.user_id);
  if (!member) {
    throw new Error("존재하지 않는 사용자입니다.");
  }

  if (member.status !== "A") {
    throw new Error("비활성 상태의 사용자입니다.");
  }

  const mission = await getMissionById(data.mission_id);
  if (!mission) {
    throw new Error("존재하지 않는 미션입니다.");
  }

  if (mission.status !== "A") {
    throw new Error("도전할 수 없는 미션입니다.");
  }

  const missionExpiredDate = new Date(mission.expired_date);
  if (Number.isNaN(missionExpiredDate.getTime())) {
    throw new Error("미션 만료일 정보가 올바르지 않습니다.");
  }

  if (missionExpiredDate <= new Date()) {
    throw new Error("이미 만료된 미션입니다.");
  }

  const existingUserMission = await findUserMissionByUserIdAndMissionId(
    data.user_id,
    data.mission_id
  );

  if (existingUserMission) {
    if (existingUserMission.status === "G") {
      throw new Error("이미 도전 중인 미션입니다.");
    }

    if (existingUserMission.status === "C") {
      throw new Error("이미 완료한 미션입니다.");
    }

    throw new Error("이미 등록된 미션입니다.");
  }

  const userMissionId = await insertUserMission({
    user_id: data.user_id,
    mission_id: data.mission_id,
    expired_date: missionExpiredDate,
  });

  const userMission = await getUserMissionById(userMissionId);
  if (!userMission) {
    throw new Error("도전 미션 저장에 실패했습니다.");
  }

  return responseFromUserMission(userMission);
};