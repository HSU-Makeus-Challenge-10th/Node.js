// 1-1. 가게 추가 요청 DTO
export interface StoreCreateRequest {
  region_id: number;
  name: string;
  category: string;
  owner_number: string;
}

// 1-2. 리뷰 추가 요청 DTO
export interface ReviewCreateRequest {
  user_id: number;
  rating: number;
  content: string;
}
