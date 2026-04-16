import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../../db.config.js";


export const addMission = async (data: {
  store_id: number
  title: string
  description: string
  point: number
  expired_date: Date
}): Promise<number> => {
  const [result] = await pool.query<ResultSetHeader>(
    `
    INSERT INTO mission
      (title, store_id, description, point, reg_date, expired_date, status)
    VALUES
      (?, ?, ?, ?, NOW(), ?, 'A')
    `,
    [data.title, data.store_id, data.description, data.point, data.expired_date]
  )

  return result.insertId;
};

export const getMissionById = async (missionId: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT
      m.id,
      m.store_id,
      s.name AS store_name,
      m.title,
      m.description,
      m.point,
      m.reg_date,
      m.expired_date,
      m.status
    FROM mission m
    INNER JOIN store s ON m.store_id = s.id
    WHERE m.id = ?
    `,
    [missionId]
  );

  return rows[0] ?? null;
};

export const findUserMissionByUserIdAndMissionId = async (
  userId: number,
  missionId: number
) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT id, user_id, mission_id, expired_date, complete_date, status
    FROM user_mission
    WHERE user_id = ? AND mission_id = ?
    ORDER BY id DESC
    LIMIT 1
    `,
    [userId, missionId]
  );

  return rows[0] ?? null;
};

export const insertUserMission = async (data: {
  user_id: number
  mission_id: number
  expired_date: Date
}): Promise<number> => {
  const [result] = await pool.query<ResultSetHeader>(
    `
    INSERT INTO user_mission
      (mission_id, user_id, expired_date, complete_date, status)
    VALUES
      (?, ?, ?, NULL, 'G')
    `,
    [data.mission_id, data.user_id, data.expired_date]
  );

  return result.insertId;
};

export const getUserMissionById = async (userMissionId: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT
      um.id,
      um.mission_id,
      m.title AS mission_title,
      m.store_id,
      s.name AS store_name,
      um.user_id,
      mb.login_id AS user_login_id,
      um.expired_date,
      um.complete_date,
      um.status
    FROM user_mission um
    INNER JOIN mission m ON um.mission_id = m.id
    INNER JOIN store s ON m.store_id = s.id
    INNER JOIN members mb ON um.user_id = mb.id
    WHERE um.id = ?
    `,
    [userMissionId]
  );

  return rows[0] ?? null;
};