import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../../db.config.js";

export const insertStore = async (regionId: number, name: string, address: string): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO store (region_id, name, address, score, created_at, updated_at)
       VALUES (?, ?, ?, 0, NOW(), NOW());`,
      [regionId, name, address]
    );
    return result.insertId;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

export const findStoreById = async (storeId: number): Promise<any | null> => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM store WHERE id = ?;`,
      [storeId]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

export const insertReview = async (storeId: number, memberId: number, body: string, score: number): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO review (member_id, store_id, body, score, created_at)
       VALUES (?, ?, ?, ?, NOW());`,
      [memberId, storeId, body, score]
    );
    return result.insertId;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

export const insertMission = async (storeId: number, reward: number, deadline: string, missionSpec: string): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO mission (store_id, reward, deadline, mission_spec, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW());`,
      [storeId, reward, deadline, missionSpec]
    );
    return result.insertId;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};