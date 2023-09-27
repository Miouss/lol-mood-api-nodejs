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
  req: Request,
  res: Response<any, Locals>,
  next: NextFunction
) {
  try {
    const {
      region,
      account: { puuid },
    } = res.locals;

    const matchList = await riot(region).getMatchListByPuuid(
      puuid,
      req.params.count
    );

    const matchesData: ParticipantMatchDataResponse[] = [];

    for (const matchId of matchList) {
      const isMatchStored = await Game.exists(matchId);

      const handleParticipantMatchData = async () => {
        const participantsInfos = await getParticipantsInfos(region, matchId);
        const participantsStats = await getParticipantsStats(region, matchId);

        await mergeInfosAndStats(participantsInfos, participantsStats);
      };

      if (!isMatchStored) await handleParticipantMatchData();

      const matchData = await GameInfo.getByPuuid(matchId, puuid);

      if (!matchData) await handleParticipantMatchData();

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
