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

export interface User {
  email: string;
  name: string;
  gender: string;
  age: number;
  address: string;
  specAddress: string;
  phoneNum: string;
  preferences: number[];
}

export const bodyToUser = (body: UserSignUpRequest): User => {
  return {
    email: body.email,
    name: body.name,
    gender: body.gender,
    age: body.age,
    address: body.address || "",
    specAddress: body.specAddress || "",
    phoneNum: body.phoneNum,
    preferences: body.preferences,
  };
};

export const responseFromUser = (data: { user: any; preferences: any[] }) => {
  const preferCategory = data.preferences.map((p) => p.foodCategory.name);

  return {
    email: data.user.email,
    name: data.user.name,
    preferCategory: preferCategory,
  };
};