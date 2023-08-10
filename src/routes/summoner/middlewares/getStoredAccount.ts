import { Response, NextFunction } from "express";
import { Account } from "../../../database/models";

export async function getStoredAccount(
  _: any,
  res: Response,
  next: NextFunction
) {
  try {
    const { puuid } = res.locals.updatedAccount;

    const isStored = await Account.exists(puuid);

    if (!isStored) {
      return next();
    }

    const storedAccount = (await Account.get(puuid)) as any;
    if (!storedAccount) {
      return next();
    }

    res.locals.storedAccount = storedAccount[0];

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}
