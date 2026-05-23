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

export interface UserSignUpResponse {
  email: string;
  name: string;
  preferCategory: string[];
}

export interface UserUpdateRequest {
  name?: string;
  gender?: string;
  age?: number;
  address?: string;
  detailAddress?: string;
  phoneNumber?: string;
}