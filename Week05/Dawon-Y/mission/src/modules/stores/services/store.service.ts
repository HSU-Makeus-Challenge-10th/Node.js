import { findStoreById, insertMission, insertReview, insertStore } from "../repositories/store.repository.js";

export const addStore = async (regionId: number, name: string, address: string) => {
  const storeId = await insertStore(regionId, name, address);
  return { storeId };
};

export const addReview = async (storeId: number, memberId: number, body: string, score: number) => {
  const store = await findStoreById(storeId);
  if (!store) {
    throw new Error("존재하지 않는 가게입니다.");
  }
  const reviewId = await insertReview(storeId, memberId, body, score);
  return { reviewId };
};

export const addMission = async (storeId: number, reward: number, deadline: string, missionSpec: string) => {
  const store = await findStoreById(storeId);
  if (!store) {
    throw new Error("존재하지 않는 가게입니다.");
  }
  const missionId = await insertMission(storeId, reward, deadline, missionSpec);
  return { missionId };
};