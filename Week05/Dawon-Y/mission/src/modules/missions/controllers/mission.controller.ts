import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { challengeMission } from "../services/mission.service.js";

export const handleChallengeMission = async (req: Request, res: Response, next: NextFunction) => {
  const missionId = Number(req.params.missionId);
  const { memberId } = req.body;
  const result = await challengeMission(memberId, missionId);
  res.status(StatusCodes.CREATED).json({ result });
};