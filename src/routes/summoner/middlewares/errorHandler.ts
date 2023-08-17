import { Response, NextFunction } from "express";

export async function errorHandler(
  err: any,
  _: any,
  res: Response,
  __: NextFunction
) {
  console.error(err);

  res.status(500).json({ error: err.message });
}
