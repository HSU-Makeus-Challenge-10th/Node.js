import { prisma } from "../../../db.config.js";

export const findOngoingMission = async (memberId: number, missionId: number) => {
  return await prisma.memberMission.findFirst({
    where: { memberId, missionId, status: "진행중" },
  });
};

export const insertMemberMission = async (memberId: number, missionId: number) => {
  const result = await prisma.memberMission.create({
    data: { memberId, missionId, status: "진행중" },
  });
  return result.id;
};

export const getOngoingMissions = async (memberId: number, cursor: number) => {
  return await prisma.memberMission.findMany({
    select: {
      id: true,
      status: true,
      mission: {
        select: {
          missionSpec: true,
          reward: true,
          deadline: true,
          store: {
            select: { name: true },
          },
        },
      },
    },
    where: {
      memberId,
      status: "진행중",
      id: { gt: cursor },
    },
    orderBy: { id: "asc" },
    take: 5,
  });
};

export const completeMission = async (memberMissionId: number) => {
  return await prisma.memberMission.update({
    where: { id: memberMissionId },
    data: { status: "완료" },
  });
};