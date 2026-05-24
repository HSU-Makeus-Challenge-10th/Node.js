import bcrypt from "bcrypt"
import { prisma } from "../../db.config.js";
import { UserSignUpRequest, responseFromUser, UserProFileSetupRequest } from "../dtos/user.dtos.js";
import { findMemberByEmail, findMemberByLoginID, 
     findMemberByPhoneNumber, findMemberById, insertMember,
    insertFavoriteCategories, findFavoriteCategoriesByUserId, deleteFavoriteCategoriesByUserId, 
    updateUserProfile} from "../repositories/user.repositories.js";

export const userSignUp = async (data: UserSignUpRequest) => {
    const existLoginId = await findMemberByLoginID(data.login_id);
    if (existLoginId) {
        throw new Error("이미 사용중인 아이디입니다.");
    }

    const existEmail = await findMemberByEmail(data.email);
  if (existEmail) {
    throw new Error("이미 사용 중인 이메일입니다.");
  }

  const existPhone = await findMemberByPhoneNumber(data.phone_number);
  if (existPhone) {
    throw new Error("이미 사용 중인 휴대폰 번호입니다.");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const userId = await prisma.$transaction(async (tx) => {
    const createdUserId = await insertMember(
      {
        login_id: data.login_id,
        password: hashedPassword,
        birth: data.birth,
        gender: data.gender,
        address: data.address ?? "",
        email: data.email,
        phone_number: data.phone_number,
      },
      tx
    );

    await insertFavoriteCategories(
      createdUserId,
      data.preferenceIds,
      tx 
    );

    return createdUserId;
  });

  const user = await findMemberById(userId);
  const preferences = await findFavoriteCategoriesByUserId(userId);

  return responseFromUser(user, preferences);
}

export const updateMyProfile = async (
  userId: string,
  data: UserProFileSetupRequest
) => {
  if(!data.login_id || data.login_id.trim().length === 0) {
    throw new Error("아이디를 입력하세요");
  }

  if(data.login_id.length > 20) {
    throw new Error("아이디는 20자 이하여야 합니다.");
  }

  if(!data.password || data.password.length < 8) {
    throw new Error("비밀번호는 8자 이상이어야합니다.");
  }

  if(!/^\d{8}$/.test(data.birth)) {
    throw new Error("생년월일은 YYYYMMDD 형식이어야합니다.");
  }

  if(!["M", "F", "N"].includes(data.gender)) {
    throw new Error("성별 값이 올바르지 않습니다.");
  }

  if(!data.phone_number || data.phone_number.length > 13) {
    throw new Error("휴대폰 번호가 올바르지 않습니다.");
  }

  const currentUserId = BigInt(userId);

  const existLoginId = await findMemberByLoginID(data.login_id);
  if (existLoginId && existLoginId.id !== currentUserId) {
    throw new Error("이미 사용중인 아이디입니다.");
  }

  const existPhone = await findMemberByPhoneNumber(data.phone_number);
  if(existPhone && existPhone.id !== currentUserId) {
    throw new Error("이미 사용중인 휴대폰 번호입니다.");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await prisma.$transaction(async (tx) => {
    await updateUserProfile(
      currentUserId,
      {
        login_id: data.login_id,
        password: hashedPassword,
        birth: data.birth,
        gender: data.gender,
        address: data.address ?? "",
        phone_number: data.phone_number,
      },
      tx
    );
    
    await deleteFavoriteCategoriesByUserId(currentUserId, tx);

    await insertFavoriteCategories(
      currentUserId,
      data.preferenceIds ?? [],
      tx
    );
  });


  const user = await findMemberById(currentUserId);
  const preferences = await findFavoriteCategoriesByUserId(currentUserId);

  return responseFromUser(user, preferences)
}