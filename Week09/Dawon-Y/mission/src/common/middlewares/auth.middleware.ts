import { Request, Response, NextFunction } from "express";
import passport from "passport";

export function authorizeUser() {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: false }, (err: any, user: any) => {
      if (err || !user) {
        return res.status(401).json({
          resultType: "FAILED",
          error: { errorCode: "U002", message: "로그인이 필요합니다.", data: null },
          data: null,
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
}