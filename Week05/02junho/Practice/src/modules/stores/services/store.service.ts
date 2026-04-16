import {
  insertStore,
  findStoreById,
  insertReview,
} from "../repositories/store.repository.js";
import { StoreCreateRequest, ReviewCreateRequest } from "../dtos/store.dto.js";

export const addStore = async (data: StoreCreateRequest) => {
  const storeId = await insertStore(
    data.region_id,
    data.name,
    data.category,
    data.owner_number
  );
  return { storeId };
};

export const addReview = async (
  storeId: number,
  data: ReviewCreateRequest
) => {
  const store = await findStoreById(storeId);
  if (!store) {
    throw new Error("존재하지 않는 가게입니다.");
  }

  const reviewId = await insertReview(data.user_id, storeId, data.rating, data.content);
  return { reviewId };
};
