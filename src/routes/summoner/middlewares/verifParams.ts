import { Request, Response, NextFunction } from "express";

export function verifParams(req: Request, _: Response, next: NextFunction) {
  try {
    if (req.params.summonerName === undefined) {
      throw new Error("Missing summonerName");
    }

    if (req.params.regionCode === undefined) {
      throw new Error("Missing region");
    }

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}
