import { findOngoingMission, insertMemberMission } from "../repositories/mission.repository.js";

export const challengeMission = async (memberId: number, missionId: number) => {
  const existing = await findOngoingMission(memberId, missionId);
  if (existing) {
    throw new Error("이미 도전 중인 미션입니다.");
  }
  const memberMissionId = await insertMemberMission(memberId, missionId);
  return { memberMissionId };
};