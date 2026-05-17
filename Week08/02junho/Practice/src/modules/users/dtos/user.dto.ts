export interface UserSignUpRequest {
  email: string;
  name: string;
  gender: string;
  birth: string;
  address?: string;
  detailAddress?: string;
  phoneNumber: string;
  preferences: number[];
  password?: string;
}

export interface UserSignUpResponse {
  email: string;
  name: string;
  preferCategory: string[];
}