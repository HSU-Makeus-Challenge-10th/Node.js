import { prisma } from "../../../db.config.js";

export const addUser = async (data: any) => {
  const user = await prisma.user.findFirst({ where: { email: data.email } });

  if (user) {
    return null;
  }

  const created = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      gender: data.gender,
      birth: data.birth,
      address: data.address,
      detailAddress: data.detailAddress,
      phoneNumber: data.phoneNumber,
    },
  });

  return created.id;
};

export const getUser = async (userId: number) => {
  return await prisma.user.findFirstOrThrow({ where: { id: userId } });
};

export const setPreference = async (userId: number, foodCategoryId: number) => {
  await prisma.userFavorCategory.create({
    data: {
      userId: userId,
      foodCategoryId: foodCategoryId,
    },
  });
};

export const getUserPreferencesByUserId = async (userId: number) => {
  return await prisma.userFavorCategory.findMany({
    where: { userId: userId },
    include: { foodCategory: true },
    orderBy: { foodCategoryId: "asc" },
  });
};

export const getMyReviews = async (memberId: number, cursor: number) => {
  return await prisma.review.findMany({
    select: {
      id: true,
      body: true,
      score: true,
      createdAt: true,
      store: {
        select: { name: true },
      },
    },
    where: {
      memberId,
      id: { gt: cursor },
    },
    orderBy: { id: "asc" },
    take: 5,
  });
};