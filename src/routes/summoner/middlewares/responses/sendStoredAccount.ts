import { Response, NextFunction } from "express";
import { AccountLocals } from "../../../types";

export function sendStoredAccount(
  _: any,
  res: Response<any, AccountLocals>,
  next: NextFunction
) {
  try {
    const { storedAccount, test } = res.locals;

    res.status(200).json({ test, storedAccount });
  } catch (err) {
    next(err);
  }
}
