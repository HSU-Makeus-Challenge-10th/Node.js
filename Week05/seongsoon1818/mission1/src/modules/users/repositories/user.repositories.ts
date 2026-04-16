import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../../db.config.js";

export const findMemberByLoginID = async(loginId: string) => {
  const[rows] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM members WHERE login_id = ?",
    [loginId]
  );
  return rows[0] ?? null;
}

export const findMemberByEmail = async(email: string) => {
  const[rows] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM members WHERE email = ?",
    [email]
  );
  return rows[0] ?? null;
}

export const findMemberByPhoneNumber = async (phoneNumber: string) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM members WHERE phone_number = ?",
    [phoneNumber]
  );
  return rows[0] ?? null;
};

export const insertMember = async (conn: PoolConnection, data: {
  login_id: string
  password: string;
  birth: string;
  gender: string;
  address: string;
  email: string;
  phone_number: string;}
): Promise<number> => {
  const [result] = await conn.query<ResultSetHeader>(
    `INSERT INTO members
      (login_id, password, birth, gender, address, reg_date, status, point, email, phone_number, phone_verified)
     VALUES (?, ?, ?, ?, ?, NOW(), 'A', 0, ?, ?, 'N')`,
    [
      data.login_id,
      data.password,
      data.birth,
      data.gender,
      data.address,
      data.email,
      data.phone_number,
    ]
  );

  return result.insertId;
}

export const insertFavoriteCategories = async (
  conn: PoolConnection,
  userId: number,
  categoryIds: number[]
) => {
  if (categoryIds.length === 0) return;

  const values = categoryIds.map((categoryId) => [userId, categoryId]);
  await conn.query(
    `INSERT INTO favorite_map (user_id, category_id) VALUES ?`,
    [values]
  );
};

export const findMemberById = async (userId: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, login_id, birth, gender, address, reg_date, status, point, email, phone_number, phone_verified
     FROM members
     WHERE id = ?`,
    [userId]
  );

  return rows[0] ?? null;
};

export const findFavoriteCategoriesByUserId = async (userId: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT fm.category_id, c.name
     FROM favorite_map fm
     JOIN category c ON fm.category_id = c.id
     WHERE fm.user_id = ?
     ORDER BY fm.category_id ASC`,
    [userId]
  );

  return rows;
};