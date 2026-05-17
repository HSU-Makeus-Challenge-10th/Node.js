// 요청 DTO
export interface UserSignUpRequest {
  email: string;
  name: string;
  gender: string;
  age: number;
  address?: string;
  specAddress?: string;
  phoneNum: string;
  preferences: number[];
}

// 응답 DTO
export interface UserSignUpResponse {
  email: string | null;
  name: string | null;
  preferCategory: string[];
}