import { Response, NextFunction } from "express";

export function sendMatchInfos(
  _: any,
  res: Response,
  next: NextFunction
) {
  try {
    const { test, participantsStats, participantsInfosMergedWithStats } = res.locals;

    res.status(200).json({participantsStats, test, participantsInfosMergedWithStats});
  } catch (err) {
    next(err);
  }
}
