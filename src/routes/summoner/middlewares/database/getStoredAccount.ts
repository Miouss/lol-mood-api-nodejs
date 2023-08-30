import { Response,NextFunction } from "express";
import { Account } from "../../../../database/models";
import { AccountLocals } from "../../types";

export async function getStoredAccount(
  _: any,
  res: Response<any, AccountLocals>,
  next: NextFunction
) {
  try {
    const { puuid } = res.locals.upToDateAccountWithRank;

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
    next(err);
  }
}
