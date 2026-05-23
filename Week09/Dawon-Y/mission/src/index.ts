import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { RegisterRoutes } from "./generated/routes";
import { AppError } from "./common/errors/app.error";
import swaggerUi from "swagger-ui-express";
import path from "path";
import fs from "fs";
import passport from "passport";
import { googleStrategy, jwtStrategy } from "./auth.config.js";

dotenv.config();

passport.use(googleStrategy);
passport.use(jwtStrategy);

const app: Express = express();
const port = process.env.PORT || 3000;

app.use((req: Request, res: Response, next: NextFunction) => {
  res.error = function ({ errorCode = null, message = null, data = null }) {
    return this.json({
      resultType: "FAILED",
      error: { errorCode, message, data },
      data: null,
    });
  };
  next();
});

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

const router = express.Router();
RegisterRoutes(router);
app.use("/api/v1", router);

app.get("/oauth2/login/google", passport.authenticate("google", { session: false }));
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", { session: false, failureRedirect: "/login-failed" }),
  (req: Request, res: Response) => {
    res.status(200).json({ success: true, tokens: req.user });
  }
);

const isLogin = passport.authenticate("jwt", { session: false });
app.get("/mypage", isLogin, (req: Request, res: Response) => {
  res.status(200).json({
    message: `인증 성공!`,
    user: req.user,
  });
});

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    message: err.message || null,
    data: err.data || null,
  });
});

const swaggerFile = JSON.parse(
  fs.readFileSync(path.resolve("dist/swagger.json"), "utf8")
);

swaggerFile.info.title = "UMC Mission API";
swaggerFile.info.version = "1.0.0";
swaggerFile.info.description = "UMC Node.js 스터디 미션 API 문서";

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});