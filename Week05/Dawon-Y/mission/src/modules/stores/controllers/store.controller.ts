import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { addMission, addReview, addStore } from "../services/store.service.js";

export const handleAddStore = async (req: Request, res: Response, next: NextFunction) => {
  const { regionId, name, address } = req.body;
  const result = await addStore(regionId, name, address);
  res.status(StatusCodes.CREATED).json({ result });
};

export const handleAddReview = async (req: Request, res: Response, next: NextFunction) => {
  const storeId = Number(req.params.storeId);
  const { memberId, body, score } = req.body;
  const result = await addReview(storeId, memberId, body, score);
  res.status(StatusCodes.CREATED).json({ result });
};

export const handleAddMission = async (req: Request, res: Response, next: NextFunction) => {
  const storeId = Number(req.params.storeId);
  const { reward, deadline, missionSpec } = req.body;
  const result = await addMission(storeId, reward, deadline, missionSpec);
  res.status(StatusCodes.CREATED).json({ result });
};