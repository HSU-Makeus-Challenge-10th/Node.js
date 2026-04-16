// 1. 회원가입 요청 데이터의 설계도를 만듭니다.
export interface UserSignUpRequest {
  email: string;
  name: string;
  gender: string;
  birth: string;
  address?: string;       // ?가 붙으면 '없을 수도 있음(선택)'이라는 뜻이에요!
  detailAddress?: string;
  phoneNumber: string;
  preferences: number[];
  password?: string; // 옵셔널이지만 필수처리할 예정
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

// 2. 요청받은 데이터를 우리 시스템에 맞는 데이터로 변환해주는 함수입니다. 
export const bodyToUser = (body: UserSignUpRequest): UserCreateData => {
  const birth = new Date(body.birth); //날짜 변환

  return {
    email: body.email, //필수 
    name: body.name, // 필수
    gender: body.gender, // 필수
    birth, // 필수
    address: body.address || "", //선택 
    detailAddress: body.detailAddress || "", //선택 
    phoneNumber: body.phoneNumber,//필수
    preferences: body.preferences,// 필수 
    password: body.password, // 패스워드
  };
};

// 3. 사용자 정보 밎 선호 카테고리를 응답해주기 위한 함수입니다.
export const responseFromUser = (data: { user: any; preferences: any[] }) => {
  return {
    email: data.user.email,
    name: data.user.name,
    preferCategory: data.preferences.map((pref) => pref.name),
  };
};