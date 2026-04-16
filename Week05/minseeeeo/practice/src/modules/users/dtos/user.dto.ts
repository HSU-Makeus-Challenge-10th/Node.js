// 1. 회원가입 요청 데이터의 설계도를 만듭니다.
export interface UserSignUpRequest {
  email: string;
  name: string;
  gender: string;
  birth: string;
  address?: string; // ?가 붙으면 '없을 수도 있음(선택)'이라는 뜻이에요!
  phone: string;
}

// 2. 요청받은 데이터를 우리 시스템에 맞는 데이터로 변환해주는 함수입니다.
export const bodyToUser = (body: UserSignUpRequest) => {
  const birth = new Date(body.birth); //날짜 변환

  return {
    email: body.email, //필수
    name: body.name, // 필수
    gender: body.gender, // 필수
    birth, // 필수
    address: body.address || "", //선택
    phone: body.phone, //필수
  };
};

// 2-2. bodyToUser를 통해 birth타입을 string->Date로 변경한 dto
export interface UserCreateData {
  email: string;
  name: string;
  gender: string;
  birth: Date; // string → Date
  address?: string;
  phone: string;
}

// 3. Service에서 받아온 유저 정보 + 선호 카테고리 리스트를 클라이언트에게 보여줄 형식으로 변환해주는 함수.
export const responseFromUser = ({
  user,
  preferences,
}: {
  user: any;
  preferences: any[];
}) => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    gender: user.gender,
    birth: user.birth,
    address: user.address,
    phone: user.phone,
    preferences: preferences.map((pref) => ({
      id: pref.food_category_id,
      name: pref.name,
    })),
  };
};
