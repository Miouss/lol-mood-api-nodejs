import { Request, Response, NextFunction } from "express";
import { getRIOT } from "../../utils/requests";
import { getSummonerRank } from "../utils";

export async function getUpdatedRank(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { host } = res.locals;
    const { id } = res.locals.updatedAccount;

    const endpoint = getSummonerRank(id, host);
    let updatedRank: any = await getRIOT(endpoint);

    updatedRank.forEach((element: any) => {
      if (element["queueType"] === "RANKED_SOLO_5x5") {
        const { tier, rank, leaguePoints, wins, losses } = element;
        updatedRank = {
          rank: tier,
          tier: rank,
          lp: leaguePoints,
          games: wins + losses,
          wins,
        };
      }
    });

    res.locals.updatedRank = updatedRank;

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}
