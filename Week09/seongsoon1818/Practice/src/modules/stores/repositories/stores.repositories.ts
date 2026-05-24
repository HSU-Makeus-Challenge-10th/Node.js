import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { findMemberById } from "../../users/repositories/user.repositories.js";
import { prisma } from "../../db.config.js";
import { Prisma } from "../../../generated/prisma/client.js";

type PrismaExecutor = typeof prisma | Prisma.TransactionClient

export const findStoreById = async (storeId: number | bigint | string) => {
  const store = await prisma.store.findUnique({
    where: {
      id: BigInt(storeId),
    },
    select: {
      id: true,
      name: true,
      address: true,
      regionId: true,
    },
  });

  if (!store) return null;

  return {
    id: store.id,
    name: store.name,
    address: store.address,
    region_id: store.regionId,
  };
};

export const insertStoreReview = async (data: {
  store_id: number | bigint | string;
  user_id: number | bigint | string;
  content: string;
  star: number;
}): Promise<bigint> => {
  const review = await prisma.review.create({
    data: {
      storeId: BigInt(data.store_id),
      userId: BigInt(data.user_id),
      content: data.content,
      star: data.star,

      // regDate, editDate, status는 schema.prisma의 기본값/nullable 설정으로 처리
      // regDate: @default(now())
      // editDate: null 가능
      // status: @default("A")
    },
    select: {
      id: true,
    },
  });

  return review.id;
};

export const findStoreReviewById = async (
  reviewId: number | bigint | string
) => {
  const review = await prisma.review.findUnique({
    where: {
      id: BigInt(reviewId),
    },
    select: {
      id: true,
      storeId: true,
      userId: true,
      regDate: true,
      editDate: true,
      content: true,
      status: true,
      star: true,
      store: {
        select: {
          name: true,
        },
      },
      member: {
        select: {
          loginId: true,
        },
      },
    },
  });

  if (!review) return null;

  return {
    id: review.id,
    store_id: review.storeId,
    store_name: review.store.name,
    user_id: review.userId,
    user_login_id: review.member.loginId,
    reg_date: review.regDate,
    edit_date: review.editDate,
    content: review.content,
    status: review.status,
    star: review.star,
  };
};