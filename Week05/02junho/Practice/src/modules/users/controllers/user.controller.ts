import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req: Request, res: Response, next: NextFunction ) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용
 
  try {
    const body = req.body;
    if (!body.email || !body.name || !body.gender || !body.birth || !body.phoneNumber || !body.password) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "email, name, gender, birth, phoneNumber, password는 필수 항목입니다.",
      });
      return;
    }

	  //서비스 로직 호출 
    const user = await userSignUp(bodyToUser(body));
    
    //성공 응답 보내기
    res.status(StatusCodes.CREATED).json({ result: user });
  } catch (err) {
    if (err instanceof Error && err.message === "이미 존재하는 이메일입니다.") {
      res.status(StatusCodes.CONFLICT).json({ success: false, message: err.message });
      return;
    }
    next(err);
  }
};