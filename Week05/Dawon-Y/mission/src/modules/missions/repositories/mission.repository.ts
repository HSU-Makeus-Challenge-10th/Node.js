import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../../db.config.js";

export const findOngoingMission = async (memberId: number, missionId: number): Promise<any | null> => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM member_mission WHERE member_id = ? AND mission_id = ? AND status = '진행중';`,
      [memberId, missionId]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

export const insertMemberMission = async (memberId: number, missionId: number): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO member_mission (member_id, mission_id, status, created_at, updated_at)
       VALUES (?, ?, '진행중', NOW(), NOW());`,
      [memberId, missionId]
    );
    return result.insertId;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};