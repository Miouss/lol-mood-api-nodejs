import { Response, NextFunction } from "express";
import { Locals } from "../../types";

export function sendMatchInfos(_: any, res: Response<any, Locals>, next: NextFunction) {
  try {
    const { participantsInfosMergedWithStats } = res.locals;

    res.status(200).json(participantsInfosMergedWithStats);
  } catch (err) {
    next(err);
  }
}
