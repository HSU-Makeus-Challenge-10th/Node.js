import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../../db.config";

export const addUser = async (data: any): Promise<number | null> => {
  const conn = await pool.getConnection();

  try {
    const [confirm] = await pool.query<RowDataPacket[]>(
      `SELECT EXISTS(SELECT 1 FROM member WHERE email = ?) as isExistEmail;`,
      [data.email]
    );

    if (confirm[0]?.isExistEmail) {
      return null;
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO member (email, name, gender, age, address, spec_address, phone_num) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        data.email,
        data.name,
        data.gender,
        data.age,
        data.address,
        data.specAddress,
        data.phoneNum,
      ]
    );

    return result.insertId;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

export const getUser = async (userId: number): Promise<any | null> => {
  const conn = await pool.getConnection();

  try {
    const [user] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM member WHERE id = ?;`,
      [userId]
    );

    if (user.length === 0) {
      return null;
    }

    return user[0];
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

export const setPreference = async (userId: number, foodCategoryId: number): Promise<void> => {
  const conn = await pool.getConnection();

  try {
    await pool.query(
      `INSERT INTO member_prefer (category_id, member_id) VALUES (?, ?);`,
      [foodCategoryId, userId]
    );
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

export const getUserPreferencesByUserId = async (userId: number): Promise<any[]> => {
  const conn = await pool.getConnection();

  try {
    const [preferences] = await pool.query<RowDataPacket[]>(
      "SELECT mp.id, mp.category_id, mp.member_id, fc.name " +
      "FROM member_prefer mp JOIN food_category fc ON mp.category_id = fc.id " +
      "WHERE mp.member_id = ? ORDER BY mp.category_id ASC;",
      [userId]
    );

    return preferences as any[];
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};