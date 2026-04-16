import { responseFromStoreReview, CreateStoreReviewData } from "../dtos/stores.dtos.js";
import { findMemberById } from "../../users/repositories/user.repositories.js";
import { findStoreById, findStoreReviewById, insertStoreReview } from "../repositories/stores.repositories.js";

export const createStoreReview = async(data: CreateStoreReviewData) => {
    if (!Number.isInteger(data.store_id) || data.store_id <= 0) {
        throw new Error ("잘못된 가게 id입니다.");
    }

    if (!Number.isInteger(data.user_id) || data.user_id <= 0) {
    throw new Error("잘못된 사용자 id입니다.");
  }

  if (!data.content || data.content.trim().length === 0) {
    throw new Error("리뷰 내용이 없습니다.");
  }

  if (!Number.isInteger(data.star) || data.star < 1 || data.star > 5) {
    throw new Error("별점은 1점부터 5점 사이의 정수여야 합니다.");
  }

  const store = await findStoreById(data.store_id);
  if (!store) {
    throw new Error("존재하지 않는 가게입니다.");
  }

  const member = await findMemberById(data.user_id);
  if (!member) {
    throw new Error("존재하지 않는 사용자입니다.");
  }

  if (member.status !== "A") {
    throw new Error("비활성회된 사용자입니다.");
  }

  const reviewId = await insertStoreReview({
    store_id: data.store_id,
    user_id: data.user_id,
    content: data.content,
    star: data.star,
  });

  const review = await findStoreReviewById(reviewId);
  if (!review) {
    throw new Error("리뷰 저장 오류");
  }

  return responseFromStoreReview(review);
}