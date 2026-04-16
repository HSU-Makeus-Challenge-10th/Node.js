import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../db.config.js";

export const addUser = async (data: any): Promise<number | null> => {
    const conn = await pool.getConnection();

    try {
        const [confirm] = await pool.query<RowDataPacket[]>(
            "SELECT EXISTS(SELECT 1 FROM user WHERE login_id = ?) as isExistUser;",
            [data.login_id]
        );

        if (confirm[0]?.isExistUser) {
            return null;
        }

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO members (login_id, password, birth, gender, addresss, email, phone_number, reg_date
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    data.login_id,
                    data.password,
                    data.birth,
                    data.gender,
                    data.address,
                    data.email,
                    data.phone_number,
                    data.reg_date
                ]
        );
        return result.insertId;
    } catch(err) {
        throw new Error("오류 발생" + err);
    } finally {
        conn.release();
    }
};

export const getUser = async (userId: number): Promise<any | null> => {
  const conn = await pool.getConnection();

  try {
    const [user] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM user WHERE id = ?;`,
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
      `INSERT INTO user_favor_category (category_id, user_id) VALUES (?, ?);`,
      [foodCategoryId, userId]
    );
  } catch (err) {
    throw new Error(`오류가 발생: ${err}`);
  } finally {
    conn.release();
  }
};

export const getUserPreferencesByUserId = async (userId: number): Promise<any[]> => {
  const conn = await pool.getConnection();

  try {
    const [preferences] = await pool.query<RowDataPacket[]>(
      "SELECT ufc.id, ufc.food_category_id, ufc.user_id, fcl.name " +
      "FROM user_favor_category ufc JOIN food_category fcl on ufc.food_category_id = fcl.id " +
      "WHERE ufc.user_id = ? ORDER BY ufc.food_category_id ASC;",
      [userId]
    );

    return preferences as any[];
  } catch (err) {
    throw new Error(`오류가 발생: ${err}`);
  } finally {
    conn.release();
  }
};