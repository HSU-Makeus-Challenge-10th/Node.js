export interface StoreCreateRequest {
  region_id: number;
  name: string;
  address: string;
  category: string;
  description?: string;
  status?: string;
}

export interface ReviewCreateRequest {
  user_mission_id: number;
  rating: number;
  content: string;
}

// 1-3. 리뷰 목록 조회 응답 DTO
export interface ReviewItem {
  id: number;
  rating: any;
  content: string;
  createdAt: Date;
  userMission: any;
}

export interface ReviewListResponse {
  data: ReviewItem[];
  pagination: {
    cursor: number | null;
  };
}

export const responseFromReviews = (reviews: ReviewItem[]): ReviewListResponse => {
  const lastReview = reviews[reviews.length - 1];
  return {
    data: reviews,
    pagination: {
      cursor: lastReview ? lastReview.id : null,
    },
  };
};
