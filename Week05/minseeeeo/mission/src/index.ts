import dotenv from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { StatusCodes } from "http-status-codes";

import { handleCreateStore, handleCreateReview } from "./modules/stores/controllers/store.controller.js";
import { handleCreateMission, handleStartMissionChallenge } from "./modules/missions/controllers/mission.controller.js";
import { handleUserSignUp } from "./modules/users/controllers/user.controller.js";

// 1. 환경 변수 설정
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// 2. 미들웨어 설정
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 3. 라우트 등록
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! This is TypeScript Server!");
});

// 1-1. 특정 지역에 가게 추가하기
app.post("/stores", handleCreateStore);

// 1-2. 가게에 리뷰 추가하기
app.post("/stores/:storeId/reviews", handleCreateReview);

// 1-3. 가게에 미션 추가하기
app.post("/stores/:storeId/missions", handleCreateMission);

// 1-4. 미션 도전하기
app.post("/missions/:missionId/challenge", handleStartMissionChallenge);

// 회원가입
app.post("/users/signup", handleUserSignUp);

// 4. 글로벌 에러 핸들러
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "서버 내부 오류가 발생했습니다.",
  });
});

// 5. 서버 시작
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
