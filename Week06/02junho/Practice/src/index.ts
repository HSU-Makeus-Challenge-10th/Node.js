import "dotenv/config";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { StatusCodes } from "http-status-codes";

import { handleUserSignUp } from "./modules/users/controllers/user.controller.js";
import { handleCreateStore, handleCreateReview, handleListStoreReviews } from "./modules/stores/controllers/store.controller.js";
import { handleCreateMission, handleStartMissionChallenge } from "./modules/missions/controllers/mission.controller.js";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! This is TypeScript Server!");
});

app.post("/api/v1/users/signup", handleUserSignUp);
app.post("/api/v1/stores", handleCreateStore);
app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);
app.post("/api/v1/stores/:storeId/reviews", handleCreateReview);
app.post("/api/v1/stores/:storeId/missions", handleCreateMission);
app.post("/api/v1/missions/:missionId/challenge", handleStartMissionChallenge);

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "서버 내부 오류가 발생했습니다.",
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
