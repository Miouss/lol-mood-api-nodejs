import { Request, Response, NextFunction } from "express";
import { riot } from "../../../riot-api/utils";
import {
  Game,
  GameInfo,
  ParticipantMatchDataResponse,
} from "../../../database/models";
import {
  extractParticipantsInfos,
  extractParticipantsStats,
  mergeInfosAndStats,
} from "../utils";
import { Locals } from "../types";

export async function retrieveMatchesData(
  _: Request,
  res: Response<any, Locals>,
  next: NextFunction
) {
  try {
    const { region, account } = res.locals;

    const matchList = await riot(region).getMatchListByPuuid(account.puuid);

    let matchesData: ParticipantMatchDataResponse[] = [];

    for (const matchId of matchList) {
      const isMatchStored = await Game.exists(matchId);

      if (!isMatchStored) {
        const participantsInfos = await getParticipantsInfos(region, matchId);

        const participantsStats = await getParticipantsStats(region, matchId);

        await mergeInfosAndStats(participantsInfos, participantsStats);
      }

      const matchData = await GameInfo.getGameStatsByPuuid(
        matchId,
        account.puuid
      );

      matchesData.push(matchData);
    }

    res.locals.matchesData = matchesData;

    next();
  } catch (err) {
    next(err);
  }
}

async function getParticipantsInfos(region: string, matchId: string) {
  const matchInfos = await riot(region).getMatchInfosByMatchId(matchId);

  const participantsInfos = await extractParticipantsInfos(matchInfos);

  return participantsInfos;
}

async function getParticipantsStats(region: string, matchId: string) {
  const matchTimeline = await riot(region).getMatchTimelineByMatchId(matchId);

  const participantsStats = await extractParticipantsStats(matchTimeline);

  return participantsStats;
}
