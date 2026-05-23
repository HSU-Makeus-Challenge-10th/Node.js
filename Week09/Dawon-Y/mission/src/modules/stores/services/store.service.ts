import { findStoreById, insertReview, insertStore, insertMission, getStoreReviews, getStoreMissions } from "../repositories/store.repository.js";
import { StoreNotFoundError } from "../../../common/errors/error.js";

export const addStore = async (regionId: number, name: string, address: string) => {
  const storeId = await insertStore(regionId, name, address);
  return { storeId };
};

export const addReview = async (storeId: number, memberId: number, body: string, score: number) => {
  const store = await findStoreById(storeId);
  if (!store) throw new StoreNotFoundError("존재하지 않는 가게입니다.", { storeId });
  const reviewId = await insertReview(storeId, memberId, body, score);
  return { reviewId };
};

export const addMission = async (storeId: number, reward: number, deadline: string, missionSpec: string) => {
  const store = await findStoreById(storeId);
  if (!store) throw new StoreNotFoundError("존재하지 않는 가게입니다.", { storeId });
  const missionId = await insertMission(storeId, reward, deadline, missionSpec);
  return { missionId };
};

export const listStoreReviews = async (storeId: number, cursor: number) => {
  const reviews = await getStoreReviews(storeId, cursor);
  const lastReview = reviews[reviews.length - 1];
  return {
    data: reviews,
    pagination: { cursor: lastReview ? lastReview.id : null },
  };
};

export const listStoreMissions = async (storeId: number, cursor: number) => {
  const missions = await getStoreMissions(storeId, cursor);
  const lastMission = missions[missions.length - 1];
  return {
    data: missions,
    pagination: { cursor: lastMission ? lastMission.id : null },
  };
};