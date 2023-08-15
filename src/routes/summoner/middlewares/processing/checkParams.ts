import { Request, Response, NextFunction } from "express";

export function checkParams(req: Request, _: Response, next: NextFunction) {
  try {
    const checkFct: {
      [key: string]: (params: Record<string, string>) => void;
    } = {
      ["/account/:regionCode/:summonerName"]: checkAccountPath,
      ["/matches/:regionCode/:puuid"]: checkMatchesPath,
    };

    checkFct[req.route.path](req.params);

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}

function checkAccountPath(params: Record<string, string>) {
  if (params.summonerName === undefined) {
    throw new Error("Missing summonerName");
  }

  if (params.regionCode === undefined) {
    throw new Error("Missing region");
  }
}

function checkMatchesPath(params: Record<string, string>) {
  if (params.regionCode === undefined) {
    throw new Error("Missing region");
  }

  if (params.puuid === undefined) {
    throw new Error("Missing matchId");
  }
}
