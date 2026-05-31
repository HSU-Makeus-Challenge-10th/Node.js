export interface StoreCreateRequest {
  /** 지역 ID */
  region_id: number;
  /** 가게 이름 */
  name: string;
  /** 가게 주소 */
  address: string;
  /** 카테고리 */
  category: string;
  /** 가게 설명 */
  description?: string;
  /** 가게 상태 */
  status?: string;
}

export interface ReviewCreateRequest {
  /** 작성자 유저 ID */
  user_id: number;
  /** 평점 */
  rating: number;
  /** 리뷰 내용 */
  content: string;
}

export interface ReviewItem {
  id: number;
  content: string;
  store: any;
  user: any;
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