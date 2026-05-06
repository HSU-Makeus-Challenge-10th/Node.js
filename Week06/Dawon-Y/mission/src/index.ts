import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { handleUserSignUp, handleListMyReviews } from "./modules/users/controllers/user.controller.js";
import { handleAddStore, handleAddReview, handleAddMission, handleListStoreReviews, handleListStoreMissions } from "./modules/stores/controllers/store.controller.js";
import { handleChallengeMission, handleListOngoingMissions, handleCompleteMission } from "./modules/missions/controllers/mission.controller.js";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! This is TypeScript Server!");
});

// 회원가입
app.post("/api/v1/users/signup", handleUserSignUp);

// 내 리뷰 목록
app.get("/api/v1/members/:memberId/reviews", handleListMyReviews);

// 가게
app.post("/api/v1/regions/:regionId/stores", handleAddStore);
app.post("/api/v1/stores/:storeId/reviews", handleAddReview);
app.post("/api/v1/stores/:storeId/missions", handleAddMission);
app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);
app.get("/api/v1/stores/:storeId/missions", handleListStoreMissions);

// 미션 도전
app.post("/api/v1/missions/:missionId/challenge", handleChallengeMission);
app.get("/api/v1/members/:memberId/missions", handleListOngoingMissions);
app.patch("/api/v1/member-missions/:memberMissionId/complete", handleCompleteMission);

app.listen(port, () => {
  console.log(`[server]: Server is running at <http://localhost>:${port}`);
});