import express, {Express, Request, Response, NextFunction} from "express";
import dotenv from "dotenv";
/*
import { handleUserSignUp } from "./users/controllers/user.controllers.js";
import { handleCreateStoreReview, handleGetStoreMissions } from "./stores/controllers/stores.controllers.js";
import { handleCreateStoreMission, handleStartMissionChallenge,
    handleGetOngoingMissions, handleCompleteMissionChallenge } from "./missions/controllers/mission.controllers.js";
*/
import { ValidateError } from "tsoa";
import { RegisterRoutes } from "../generated/routes.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";

dotenv.config();

const app : Express = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"))
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("/", (req:Request, res:Response) => {
    res.send("hello world!");
});

RegisterRoutes(app);

app.use(
    (
        err: unknown,
        _req: Request,
        res: Response,
        next: NextFunction
    ): Response | void => {
        if (err instanceof ValidateError) {
            return res.status(400).json({
                isSuccess: false,
                code: "400",
                message: "요청 값이 올바르지 않습니다.",
                result: err.fields,
            });
        }

        if (err instanceof Error) {
            return res.status(400).json({
                isSuccess: false,
                code: "400",
                message: err.message,
                result: null,
            });
        }

        next();
    }
)

/*
app.post("/users/signup", handleUserSignUp);

app.post("/stores/:storeId/reviews", handleCreateStoreReview);

app.post("/stores/:storeId/missions", handleCreateStoreMission);

app.post("/missions/:missionId/challenges", handleStartMissionChallenge);

app.get("/stores/:storeId/show-missions", handleGetStoreMissions);

app.get("/missions/:userId/ongoing", handleGetOngoingMissions);

app.patch("/missions/:userId/:missionId/tocomplete", handleCompleteMissionChallenge);
*/
app.listen(port, () => {
    console.log(`${port}번 포트에서 대기중`)
});
