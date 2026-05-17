import { UserSignUpRequest, UserSignUpResponse } from "../dtos/user.dto.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
  getMyReviews,
} from "../repositories/user.repository.js";
import { DuplicateUserEmailError } from "../../../common/errors/error.js";

export const userSignUp = async (data: UserSignUpRequest): Promise<UserSignUpResponse> => {
  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    gender: data.gender,
    age: data.age,
    address: data.address,
    specAddress: data.specAddress,
    phoneNum: data.phoneNum,
  });

  if (joinUserId === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
  }

  for (const preference of data.preferences) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);

  if (!user) {
    throw new Error("유저를 찾을 수 없습니다.");
  }

  const preferences = (await getUserPreferencesByUserId(joinUserId)).map(
    (p) => p.foodCategory.name,
  );

  return {
    email: user.email as string,
    name: user.name as string,
    preferCategory: preferences,
  };
};

export const listMyReviews = async (memberId: number, cursor: number) => {
  const reviews = await getMyReviews(memberId, cursor);
  const lastReview = reviews[reviews.length - 1];
  return {
    data: reviews,
    pagination: {
      cursor: lastReview ? lastReview.id : null,
    },
  };
};