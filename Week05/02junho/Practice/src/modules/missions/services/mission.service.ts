import {
  insertMission,
  findMissionById,
  findChallengingUserMission,
  insertUserMission,
} from "../repositories/mission.repository.js";
import { findStoreById } from "../../stores/repositories/store.repository.js";
import { MissionCreateRequest } from "../dtos/mission.dto.js";

// 1-3. 미션 추가하기
export const addMission = async (storeId: number, data: MissionCreateRequest) => {
  const store = await findStoreById(storeId);
  if (!store) {
    throw new Error("존재하지 않는 가게입니다.");
  }

  const missionId = await insertMission(
    storeId,
    data.field,
    data.point,
    data.due_at,
    data.requirement
  );
  return { missionId };
};

// 1-4. 미션 도전하기
export const challengeMission = async (user_id: number, missionId: number) => {
  const mission = await findMissionById(missionId);
  if (!mission) {
    throw new Error("존재하지 않는 미션입니다.");
  }

  const existing = await findChallengingUserMission(user_id, missionId);
  if (existing) {
    throw new Error("이미 도전 중인 미션입니다.");
  }

  const userMissionId = await insertUserMission(user_id, missionId);
  return { userMissionId };
};
