import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { challengeMission, listOngoingMissions, updateMissionComplete } from "../services/mission.service.js";

export const handleChallengeMission = async (req: Request, res: Response, next: NextFunction) => {
  const missionId = Number(req.params.missionId);
  const { memberId } = req.body;
  const result = await challengeMission(memberId, missionId);
  res.status(StatusCodes.CREATED).json({ result });
};

export const handleListOngoingMissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const memberId = parseInt(req.params.memberId as string, 10);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor, 10) : 0;
    const missions = await listOngoingMissions(memberId, cursor);
    res.status(StatusCodes.OK).json(missions);
  } catch (err) {
    next(err);
  }
};

export const handleCompleteMission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const memberMissionId = parseInt(req.params.memberMissionId as string, 10);
    const result = await updateMissionComplete(memberMissionId);
    res.status(StatusCodes.OK).json({ result });
  } catch (err) {
    next(err);
  }
};