import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import cors from "cors";
import { handleUserSignUp } from "./users/controllers/user.controllers.js";
import { handleCreateStoreReview } from "./stores/controllers/stores.controllers.js";
import { handleCreateStoreMission, handleStartMissionChallenge } from "./missions/controllers/mission.controllers.js";

dotenv.config();

const app : Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/", (req:Request, res:Response) => {
    res.send("hello world!");
});

app.listen(port, () => {
    console.log(`${port}번 포트에서 대기중`)
});

app.post("/users/signup", handleUserSignUp);

app.post("/stores/:storeId/reviews", handleCreateStoreReview);

app.post("/stores/:storeId/missions", handleCreateStoreMission);

app.post("/missions/:missionId/challenges", handleStartMissionChallenge);