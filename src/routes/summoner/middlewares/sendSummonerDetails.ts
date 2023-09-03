import { Request, Response, NextFunction } from "express";
import { Locals } from "../types";

export function sendSummonerDetails(
  _: Request,
  res: Response<any, Locals>,
  next: NextFunction
) {
  try {
    const { account, matchesData, topChampsByMostPlayed } = res.locals;

    res.json({ account, matchesData, topChampsByMostPlayed });
  } catch (err) {
    next(err);
  }
}
