import {
  insertMission,
  findMissionById,
  findChallengingUserMission,
  insertUserMission,
} from "../repositories/mission.repository";
import { findStoreById } from "../../stores/repositories/store.repository";
import { MissionCreateRequest } from "../dtos/mission.dto";
import { NotFoundError, AlreadyExistsError } from "../../../common/errors/error";

export const addMission = async (storeId: number, data: MissionCreateRequest) => {
  const store = await findStoreById(storeId);
  if (!store) {
    throw new NotFoundError("존재하지 않는 가게입니다.", { storeId });
  }
  const missionId = await insertMission(storeId, data.field, data.point, data.due_at, data.requirement);
  return { missionId };
};

export const challengeMission = async (user_id: number, missionId: number) => {
  const mission = await findMissionById(missionId);
  if (!mission) {
    throw new NotFoundError("존재하지 않는 미션입니다.", { missionId });
  }
  const existing = await findChallengingUserMission(user_id, missionId);
  if (existing) {
    throw new AlreadyExistsError("이미 도전 중인 미션입니다.", { user_id, missionId });
  }
  const userMissionId = await insertUserMission(user_id, missionId);
  return { userMissionId };
};