import { Request, Response, NextFunction } from "express";
import { getRIOT } from "../../utils/requests";
import { getSummonerByName } from "../utils";

export async function getUpdatedAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const { summonerName } = req.query as any;
    const { host } = res.locals;

    const endpoint = getSummonerByName(summonerName, host);
    
    const updatedAccount: any = await getRIOT(endpoint);

    delete updatedAccount.accountId;
    delete updatedAccount.revisionDate;
    
    res.locals.updatedAccount = updatedAccount;

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}
