import { pool, prisma } from "../../../db.config.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export interface StoreRow extends RowDataPacket {
  id: bigint;
  region_id: bigint;
  name: string;
  address: string;
  category: string;
  description: string;
  status: string;
}

export const insertStore = async (
  region_id: number,
  name: string,
  address: string,
  category: string,
  description: string,
  status: string
): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO stores (region_id, name, address, category, description, status) VALUES (?, ?, ?, ?, ?, ?)",
      [region_id, name, address, category, description, status]
    );
    return result.insertId;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

export const findStoreById = async (storeId: number): Promise<StoreRow | null> => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await pool.query<StoreRow[]>(
      "SELECT * FROM stores WHERE id = ?",
      [storeId]
    );
    return rows[0] ?? null;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

export const insertReview = async (
  user_mission_id: number,
  rating: number,
  content: string
): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO reviews (user_mission_id, rating, content) VALUES (?, ?, ?)",
      [user_mission_id, rating, content]
    );
    return result.insertId;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

export const getAllStoreReviews = async (storeId: number, cursor: number) => {
  return await prisma.review.findMany({
    select: {
      id: true,
      content: true,
      store: true,
      user: true,
    },
    where: {
      storeId,
      id: { gt: cursor },
    },
    orderBy: { id: "asc" },
    take: 5,
  });
};
