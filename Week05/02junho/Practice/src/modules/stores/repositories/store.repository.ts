import { pool } from "../../../db.config.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export interface StoreRow extends RowDataPacket {
  id: bigint;
  region_id: bigint;
  name: string;
  category: string;
  owner_number: string;
}

export const insertStore = async (
  region_id: number,
  name: string,
  category: string,
  owner_number: string
): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO stores (region_id, name, category, owner_number) VALUES (?, ?, ?, ?)",
      [region_id, name, category, owner_number]
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
    const [rows] = await pool.execute<StoreRow[]>(
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
  user_id: number,
  store_id: number,
  rating: number,
  content: string
): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO reviews (user_id, store_id, rating, content) VALUES (?, ?, ?, ?)",
      [user_id, store_id, rating, content]
    );
    return result.insertId;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};
