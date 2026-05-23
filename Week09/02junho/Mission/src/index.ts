import "dotenv/config";
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import path from "path";
import fs from "fs";
import { googleStrategy, jwtStrategy } from "./auth.config";
import { RegisterRoutes } from "./generated/routes";
import { AppError } from "./common/errors/app.error";

const app: Express = express();
const port = process.env.PORT || 3000;

// Passport 전략 등록
passport.use(googleStrategy);
passport.use(jwtStrategy);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.error = function ({ errorCode = null, message = null, data = null }) {
    return this.json({
      resultType: "FAIL",
      error: { errorCode, message, data },
      data: null,
    });
  };
  next();
});

app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

// Swagger UI 연결
const swaggerFile = JSON.parse(
  fs.readFileSync(path.resolve("dist/swagger.json"), "utf8")
);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Google OAuth 라우트
app.get("/oauth2/login/google", passport.authenticate("google", { session: false }));

app.get("/oauth2/callback/google",
  passport.authenticate("google", { session: false, failureRedirect: "/login-failed" }),
  (req: Request, res: Response) => {
    res.status(200).json({ success: true, tokens: req.user });
  }
);

// JWT 보호된 테스트 라우트
const isLogin = passport.authenticate("jwt", { session: false });

app.get("/mypage", isLogin, (req: Request, res: Response) => {
  res.status(200).json({
    message: `인증 성공! ${(req.user as any).name}님의 마이페이지입니다.`,
    user: req.user,
  });
});

// TSOA 라우트
const router = express.Router();
RegisterRoutes(router);
app.use("/api/v1", router);

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

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});