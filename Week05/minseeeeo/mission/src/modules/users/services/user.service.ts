import bcrypt from "bcrypt";
import { UserCreateData } from "../dtos/user.dto.js";
import { responseFromUser } from "../dtos/user.dto.js";
import { addUser, getUser } from "../repositories/user.repository.js";

const SALT_ROUNDS = 10; // 해싱 강도 (높을수록 안전하지만 느림)

export const userSignUp = async (data: UserCreateData) => {
  // 비밀번호 해싱 — DB에는 절대 평문을 저장하지 않습니다.
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    gender: data.gender,
    birth: new Date(data.birth),
    address: data.address,
    phone: data.phone,
    password: hashedPassword, // 해싱된 비밀번호 전달
  });

  if (joinUserId === null) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  const user = await getUser(joinUserId);

  return responseFromUser({ user, preferences: [] });
};
