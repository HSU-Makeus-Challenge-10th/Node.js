import bcrypt from "bcrypt"
import {pool} from "../../db.config.js";
import { UserSignUpRequest, responseFromUser } from "../dtos/user.dtos.js";
import { findMemberByEmail, findMemberByLoginID, 
     findMemberByPhoneNumber, findMemberById, insertMember,
    insertFavoriteCategories, findFavoriteCategoriesByUserId } from "../repositories/user.repositories.js";

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

  const conn = await pool.getConnection();

  try{
    await conn.beginTransaction();

    const userId = await insertMember(conn, {
      login_id: data.login_id,
      password: hashedPassword,
      birth: data.birth,
      gender: data.gender,
      address: data.address ?? "",
      email: data.email,
      phone_number: data.phone_number,
    });

    await insertFavoriteCategories(conn, userId, data.preferenceIds);

    await conn.commit();

    const user = await findMemberById(userId);
    const preferences = await findFavoriteCategoriesByUserId(userId);

    return responseFromUser(user, preferences);
  } catch (error) {
    await conn.rollback();
    throw(error);
  } finally {
    conn.release();
  }
}