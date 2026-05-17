import { findOngoingMission, insertMemberMission, getOngoingMissions, completeMission } from "../repositories/mission.repository.js";
import { DuplicateMissionError } from "../../../common/errors/error.js";

export const challengeMission = async (memberId: number, missionId: number) => {
  const existing = await findOngoingMission(memberId, missionId);
  if (existing) throw new DuplicateMissionError("이미 도전 중인 미션입니다.", { memberId, missionId });
  const memberMissionId = await insertMemberMission(memberId, missionId);
  return { memberMissionId };
};

export const listOngoingMissions = async (memberId: number, cursor: number) => {
  const missions = await getOngoingMissions(memberId, cursor);
  const lastMission = missions[missions.length - 1];
  return {
    data: missions,
    pagination: { cursor: lastMission ? lastMission.id : null },
  };
};

export const updateMissionComplete = async (memberMissionId: number) => {
  return await completeMission(memberMissionId);
};