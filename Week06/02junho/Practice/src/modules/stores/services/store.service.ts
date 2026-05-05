import { insertStore, findStoreById, insertReview, getAllStoreReviews } from "../repositories/store.repository.js";
import { StoreCreateRequest, ReviewCreateRequest, responseFromReviews } from "../dtos/store.dto.js";

export const addStore = async (data: StoreCreateRequest) => {
  const storeId = await insertStore(data.region_id, data.name, data.address, data.category, data.description ?? "", data.status ?? "active");
  return { storeId };
};

export const addReview = async (storeId: number, data: ReviewCreateRequest) => {
  const store = await findStoreById(storeId);
  if (!store) {
    throw new Error("존재하지 않는 가게입니다.");
  }
  const reviewId = await insertReview(data.user_mission_id, data.rating, data.content);
  return { reviewId };
};

export const listStoreReviews = async (storeId: number, cursor: number) => {
  const reviews = await getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews as any[]);
};
