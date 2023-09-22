import { Request, Response, NextFunction } from "express";
import { Locals } from "../types";

export function sendStats(
  req: Request,
  res: Response<any, Locals>,
  next: NextFunction
) {
  try {
    const {
      items,
      mostPlayedStatsMods,
      runes,
      skillsOrder,
      evolvesOrder,
      summoners,
    } = res.locals;

    res.json({
      items,
      mostPlayedStatsMods,
      runes,
      skillsOrder,
      evolvesOrder,
      summoners,
    });
  } catch (err) {
    next(err);
  }
}
