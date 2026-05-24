import express, {Express, Request, Response, NextFunction} from "express";
import dotenv from "dotenv";
import cors from "cors";
/*
import { handleCreateStoreReview, handleGetStoreMissions } from "./stores/controllers/stores.controllers.js";
import { handleCreateStoreMission, handleStartMissionChallenge,
    handleGetOngoingMissions, handleCompleteMissionChallenge } from "./missions/controllers/mission.controllers.js";
*/
import { ValidateError } from "tsoa";
import { RegisterRoutes } from "../generated/routes.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import path from "path";
import fs from "fs";
import passport from "passport";
import { googleStrategy, jwtStrategy } from "./auth.config.js";
import { isLogin } from "./middlewares/auth.middlewares.js";

dotenv.config();

const app : Express = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(cookieParser());

app.use(
    cors({
        origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5500", "http://127.0.0.1:5500"],
        credentials: true,
    })
);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

passport.use(googleStrategy);
passport.use(jwtStrategy);

const swaggerFile = JSON.parse(
    fs.readFileSync(path.resolve("dist/swagger.json"), "utf-8")
);

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.get("/", (req:Request, res:Response) => {
    res.send("hello world!");
});

app.get("/oauth2/login/google", passport.authenticate("google", {session: false}));
app.get("/oauth2/callback/google", 
    passport.authenticate("google", {session: false, failureRedirect: "/login-failed"}),
    (req: Request, res: Response) => {
        res.status(200).json({
            isSuccess: true,
            code: "200",
            message: "구글 로그인을 완료하였습니다.",
            result: req.user
        });
    }
)

app.get("/login-failed", (_req: Request, res: Response)=> {
    res.status(401).json({
        isSuccess: false,
        code: "401",
        message: "구글 로그인에 실패하였습니다.",
        result: null,
    });
});

app.get("/mypage", isLogin, (req: Request, res: Response) => {
    const user = req.user as {
        id: string;
        email: string;
        loginId: string;
    };

    res.status(200).json({
        isSuccess: true,
        code: "200",
        message: `인증 성공 ${user.loginId}님의 마이페이지 입니다.`,
        result: {
            user
        }
    })
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
            console.error("error : ", err.message);
            
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
