import { Request, Response, NextFunction } from "express";
import { Locals } from "../types";

export function sendStats(
  req: Request,
  res: Response<any, Locals>,
  next: NextFunction
) {
  try {
    const { items, mostPlayedStatsMods, runesStats } = res.locals;

    res.json({ items, mostPlayedStatsMods, runesStats });
  } catch (err) {
    next(err);
  }
}
