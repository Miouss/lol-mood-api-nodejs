import { Request, Response, NextFunction } from "express";
import { getUpToDateAccount, getUpToDateRank } from "../../../riot-api/utils";
import { Account, StoredAccount } from "../../../database/models";
import { AccountWithRank } from "../../../riot-api/types";
import { getStoredAccount, updateAccount } from "../utils";

export async function retrieveAccount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { host } = res.locals;
    const { summonerName } = req.params;

    const upToDateAccount = await getUpToDateAccount(host, summonerName);
    const upToDateRank = await getUpToDateRank(host, upToDateAccount.id);

    const upToDateAccountWithRank = {
      ...upToDateAccount,
      ...upToDateRank,
    };

    const storedAccount = await getStoredAccount(upToDateAccount.puuid);

    await updateAccount(upToDateAccountWithRank, storedAccount);

    res.locals.account = upToDateAccountWithRank;

    next();
  } catch (err) {
    next(err);
  }
}
