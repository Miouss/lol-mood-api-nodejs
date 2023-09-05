import { Request, Response, NextFunction } from "express";

export function checkParams(req: Request, _: Response, next: NextFunction) {
  try {
    const checkFctByPath: CheckFctByPath = {
      [Paths.summoner]: checkAccountPath,
      [Paths.champ]: checkMatchesPath,
    };
    checkFctByPath[req.route.path](req.params);

    next();
  } catch (err) {
    next(err);
  }
}

function checkAccountPath(params: Params) {
  if (params.summonerName === undefined) {
    throw new Error("Missing summonerName");
  }

  if (params.regionCode === undefined) {
    throw new Error("Missing region");
  }
}

function checkMatchesPath(params: Params) {
  if (params.champName === undefined) {
    throw new Error("Missing champion name");
  }
}

interface CheckFctByPath {
  [key: string]: CheckFct;
}

type CheckFct = (params: Params) => void;
type Params = Record<string, string>;

enum Paths {
  "summoner" = "/:regionCode/:summonerName",
  "champ" = "/:champName",
}
