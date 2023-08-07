import { Request, Response, NextFunction } from "express";
import { getRegion } from "../utils";

export async function convertRegion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { regionCode } = req.query as any;
    const { host, region } = getRegion(regionCode);

    res.locals.host = host;
    res.locals.region = region;
    
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}
