import { pool } from "../../../db.config.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export interface MissionRow extends RowDataPacket {
  id: bigint;
  store_id: bigint;
  field: string;
  point: number;
  created_at: Date;
  updated_at: Date;
  due_at: Date;
  requirement: string;
}

export interface UserMissionRow extends RowDataPacket {
  id: bigint;
  user_id: bigint;
  mission_id: bigint;
  status: string;
  started_at: Date;
  ended_at: Date | null;
}

// DB missions 테이블에 INSERT
export const insertMission = async (
  store_id: number,
  field: string,
  point: number,
  due_at: string,
  requirement: string
): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO missions (store_id, field, point, due_at, requirement)
       VALUES (?, ?, ?, ?, ?)`,
      [store_id, field, point, due_at, requirement]
    );
    return result.insertId;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

// id 번호로 미션 찾기
export const findMissionById = async (missionId: number): Promise<MissionRow | null> => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await pool.execute<MissionRow[]>(
      "SELECT * FROM missions WHERE id = ?",
      [missionId]
    );
    return rows[0] ?? null;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

// 이미 도전 중(challenging)인 user_mission이 있는지 확인
export const findChallengingUserMission = async (
  user_id: number,
  mission_id: number
): Promise<UserMissionRow | null> => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await pool.execute<UserMissionRow[]>(
      "SELECT * FROM user_missions WHERE user_id = ? AND mission_id = ? AND status = 'challenging'",
      [user_id, mission_id]
    );
    return rows[0] ?? null;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

// DB user_missions 테이블에 '도전중'이라고 INSERT
export const insertUserMission = async (
  user_id: number,
  mission_id: number
): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO user_missions (user_id, mission_id, status)
       VALUES (?, ?, 'challenging')`,
      [user_id, mission_id]
    );
    return result.insertId;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};
