import dotenv from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { StatusCodes } from "http-status-codes";

import { handleUserSignUp } from "./modules/users/controllers/user.controller.js";
import { handleCreateStore, handleCreateReview } from "./modules/stores/controllers/store.controller.js";
import { handleCreateMission, handleStartMissionChallenge } from "./modules/missions/controllers/mission.controller.js";

// 1. 환경 변수 설정
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// 2. 미들웨어 설정
app.use(cors());            // cors 방식 허용                 
app.use(express.static('public'));    // 정적 파일 접근      
app.use(express.json());              // request의 본문을 json으로 해석할 수 있도록 함(JSON 형태의 요청 body를 파싱하기 위함)     
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

// 3. 기본 라우트
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! This is TypeScript Server!");
});

app.post("/api/v1/users/signup", handleUserSignUp);

// 1-1. 특정 지역에 가게 추가하기
app.post("/api/v1/stores", handleCreateStore);

// 1-2. 가게에 리뷰 추가하기
app.post("/api/v1/stores/:storeId/reviews", handleCreateReview);

// 1-3. 가게에 미션 추가하기
app.post("/api/v1/stores/:storeId/missions", handleCreateMission);

// 1-4. 미션 도전하기
app.post("/api/v1/missions/:missionId/challenge", handleStartMissionChallenge);

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