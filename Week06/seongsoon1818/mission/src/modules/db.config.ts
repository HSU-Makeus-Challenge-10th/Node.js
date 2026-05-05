import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

dotenv.config();

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST ?? "localhost",
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "1234",
  database: process.env.DB_NAME ?? "umc_mission_db",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  connectionLimit: 10,
});

export const prisma = new PrismaClient({
  adapter,
  log: ["query","info", "error", "warn"], // 쿼리 로그, 에러 로그, 경고 로그를 모두 출력하도록 설정
});