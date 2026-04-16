import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { handleUserSignUp } from "./modules/users/controllers/user.controller.js";
import { handleAddStore, handleAddReview, handleAddMission } from "./modules/stores/controllers/store.controller.js";
import { handleChallengeMission } from "./modules/missions/controllers/mission.controller.js";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! This is TypeScript Server!");
});

// 회원가입
app.post("/api/v1/users/signup", handleUserSignUp);

// 가게
app.post("/api/v1/regions/:regionId/stores", handleAddStore);
app.post("/api/v1/stores/:storeId/reviews", handleAddReview);
app.post("/api/v1/stores/:storeId/missions", handleAddMission);

// 미션 도전
app.post("/api/v1/missions/:missionId/challenge", handleChallengeMission);

app.listen(port, () => {
  console.log(`[server]: Server is running at <http://localhost>:${port}`);
});