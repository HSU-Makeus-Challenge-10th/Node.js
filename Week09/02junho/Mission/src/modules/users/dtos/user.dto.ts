export interface UserSignUpRequest {
  /** 유저 이메일 (로그인 시 사용) */
  email: string;
  /** 유저 이름 */
  name: string;
  /** 성별 */
  gender: string;
  /** 생년월일 (예: 2000-01-01) */
  birth: string;
  /** 주소 */
  address?: string;
  /** 상세 주소 */
  detailAddress?: string;
  /** 전화번호 */
  phoneNumber: string;
  /** 비밀번호 */
  password?: string;
  /** 선호 카테고리 ID 배열 (예: [1, 2]) */
  preferences: number[];
}

export interface UserSignUpResponse {
  email: string;
  name: string;
  preferCategory: string[];
}

// ★ 새로 추가
export interface UserUpdateRequest {
  /** 유저 이름 */
  name?: string;
  /** 성별 */
  gender?: string;
  /** 생년월일 (예: 2000-01-01) */
  birth?: string;
  /** 주소 */
  address?: string;
  /** 상세 주소 */
  detailAddress?: string;
  /** 전화번호 */
  phoneNumber?: string;
}

export interface UserUpdateResponse {
  id: number;
  email: string;
  name: string;
  gender: string;
  birth: string;
  address: string;
  phoneNumber: string;
}