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

export interface UserCreateData {
  email: string;
  name: string;
  gender: string;
  birth: Date;
  address?: string;
  detailAddress?: string;
  phoneNumber: string;
  preferences: number[];
  password?: string;
}

export const bodyToUser = (body: UserSignUpRequest): UserCreateData => {
  const birth = new Date(body.birth);
  return {
    email: body.email,
    name: body.name,
    gender: body.gender,
    birth,
    address: body.address || "",
    detailAddress: body.detailAddress || "",
    phoneNumber: body.phoneNumber,
    preferences: body.preferences,
    password: body.password,
  };
};

export const responseFromUser = (data: { user: any; preferences: any[] }) => {
  return {
    email: data.user.email,
    name: data.user.name,
    preferCategory: data.preferences.map((p) => p.foodCategory.name),
  };
};
