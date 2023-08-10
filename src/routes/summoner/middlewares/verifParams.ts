import { Request, Response, NextFunction } from "express";

export function verifParams(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.query.summonerName === undefined) {
      throw new Error("Missing summonerName");
    }

    if (req.query.regionCode === undefined) {
      throw new Error("Missing region");
    }

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}
