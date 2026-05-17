import { prisma } from "../../../db.config.js";

export const insertStore = async (regionId: number, name: string, address: string) => {
  const result = await prisma.store.create({
    data: { regionId, name, address, score: 0 },
  });
  return result.id;
};

export const findStoreById = async (storeId: number) => {
  return await prisma.store.findFirst({ where: { id: storeId } });
};

export const insertReview = async (storeId: number, memberId: number, body: string, score: number) => {
  const result = await prisma.review.create({
    data: { storeId, memberId, body, score },
  });
  return result.id;
};

export const insertMission = async (storeId: number, reward: number, deadline: string, missionSpec: string) => {
  const result = await prisma.mission.create({
    data: { storeId, reward, deadline: new Date(deadline), missionSpec },
  });
  return result.id;
};

export const getStoreReviews = async (storeId: number, cursor: number) => {
  return await prisma.review.findMany({
    select: {
      id: true,
      body: true,
      score: true,
      createdAt: true,
      member: {
        select: { name: true },
      },
    },
    where: {
      storeId,
      id: { gt: cursor },
    },
    orderBy: { id: "asc" },
    take: 5,
  });
};

export const getStoreMissions = async (storeId: number, cursor: number) => {
  return await prisma.mission.findMany({
    select: {
      id: true,
      missionSpec: true,
      reward: true,
      deadline: true,
    },
    where: {
      storeId,
      id: { gt: cursor },
    },
    orderBy: { id: "asc" },
    take: 5,
  });
};