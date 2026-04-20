import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../../db.config.js";
import { findMemberById } from "../../users/repositories/user.repositories.js";

export const findStoreById = async (storeId: number) => {
    const[rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT id, name, address, region_id
        FROM store
        WHERE id = ?
        `,
        [storeId]
    );

    return rows[0] ?? null;
}

export const insertStoreReview = async (data: {
    store_id: number
    user_id: number
    content: string
    star: number
}): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader> (
        `
        INSERT INTO review
          (store_id, user_id, reg_date, edit_date, content, status, star)
        VALUES
          (?, ?, NOW(), NULL, ?, 'A', ?)
        `,
        [data.store_id, data.user_id, data.content, data.star]
    );
    return result.insertId;
}

export const findStoreReviewById = async (reviewid: number) => {
    const [rows] = await pool.query<RowDataPacket[]> (
        `
        SELECT
          r.id,
          r.store_id,
          s.name AS store_name,
          r.user_id,
          m.login_id AS user_login_id,
          r.reg_date,
          r.edit_date,
          r.content,
          r.status,
          r.star
        FROM review r
        INNER JOIN store s ON r.store_id = s.id
        INNER JOIN members m ON r.user_id = m.id
        WHERE r.id = ?
        `,
        [reviewid]
    );

    return rows[0] ?? null;
}