import { prisma } from "../../db.config.js"
import { Prisma } from "../../../generated/prisma/client.js";

type PrismaExecutor = typeof prisma | Prisma.TransactionClient

export const findMemberByLoginID = async(loginId: string) => {
  const member = await prisma.member.findFirst({
    where : {
      loginId,
    },
    select : {
      id : true
    },
  });

  return member ?? null;
}

export const findMemberByEmail = async(email: string) => {
  const member = await prisma.member.findFirst({
    where: {
      email,
    },
    select: {
      id : true,
    },
  });

  return member ?? null;
}

export const findMemberByPhoneNumber = async (phoneNumber: string) => {
  const member = await prisma.member.findFirst({
    where: {
      phoneNumber,
    },
    select: {
      id: true,
    },
  });

  return member ?? null;
};

export const insertMember = async (
  data: {
    login_id: string;
    password: string;
    birth: string;
    gender: string;
    address: string;
    email: string;
    phone_number: string;
  },
  tx: PrismaExecutor = prisma
): Promise<bigint> => {
  const member = await tx.member.create({
    data: {
      loginId: data.login_id,
      password: data.password,
      birth: data.birth,
      gender: data.gender,
      address: data.address,
      email: data.email,
      phoneNumber: data.phone_number,
    },
    select: {
      id: true,
    },
  });

  return member.id;
};

export const insertFavoriteCategories = async (
  userId: bigint,
  categoryIds: number[],
  tx: PrismaExecutor = prisma
) => {
  if (categoryIds.length === 0) return;

  await tx.favoriteMap.createMany({
    data: categoryIds.map((categoryId) => ({
      userId,
      categoryId,
    })),
  });
};

export const findMemberById = async (userId: bigint | number | string) => {
  const member = await prisma.member.findUnique({
    where: {
      id: BigInt(userId),
    },
    select: {
      id: true,
      loginId: true,
      birth: true,
      gender: true,
      address: true,
      regDate: true,
      status: true,
      point: true,
      email: true,
      phoneNumber: true,
      phoneVerified: true,
    },
  });

  return member ?? null;
};

export const findFavoriteCategoriesByUserId = async (
  userId: number | bigint | string
) => {
  const favoriteCategories = await prisma.favoriteMap.findMany({
    where: {
      userId: BigInt(userId),
    },
    orderBy: {
      categoryId: "asc",
    },
    select: {
      categoryId: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  return favoriteCategories.map((favoriteCategory) => ({
    category_id: favoriteCategory.categoryId,
    name: favoriteCategory.category.name,
  }));
};

export const updateUserProfile = async(
  userId: bigint | string | number,
  data: {
    login_id: string;
    password: string;
    birth: string;
    gender: string;
    address: string;
    phone_number: string;
  },
  tx: PrismaExecutor = prisma
) => {
  const member = await tx.member.update({
    where: {
      id: BigInt(userId),
    },
    data: {
      loginId: data.login_id,
      password: data.password,
      birth: data.birth,
      gender: data.gender,
      address: data.address,
      phoneNumber: data.phone_number,
    },
    select: {
      id: true,
    },
  });

  return member.id;
}

export const deleteFavoriteCategoriesByUserId = async (
  userId: bigint | string | number,
  tx: PrismaExecutor = prisma
) => {
  await tx.favoriteMap.deleteMany({
    where: {
      userId: BigInt(userId),
    },
  });
};