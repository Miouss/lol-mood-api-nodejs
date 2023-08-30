import { Request, Response, NextFunction } from "express";
import { getRegion } from "../utils";

export async function convertRegion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { regionCode } = req.params;

    res.locals = getRegion(regionCode);

    next();
  } catch (err) {
    next(err);
  }
}
