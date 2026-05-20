import bcrypt from "bcrypt";
import { UserSignUpRequest, UserSignUpResponse } from "../dtos/user.dto";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository";
import { DuplicateUserEmailError } from "../../../common/errors/error";

const SALT_ROUNDS = 10;

export const userSignUp = async (data: UserSignUpRequest): Promise<UserSignUpResponse> => {
  if (!data.password) throw new Error("비밀번호가 없습니다.");
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    gender: data.gender,
    birth: new Date(data.birth),
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
    password: hashedPassword,
  });

  if (joinUserId === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
  }

  for (const preference of data.preferences) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return {
    email: user.email,
    name: user.name,
    preferCategory: preferences.map((p) => p.foodCategory.name),
  };
};