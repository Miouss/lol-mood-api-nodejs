import { Request, Response, NextFunction } from "express";
import { riot } from "../../../riot-api/utils";
import { Game, GameInfo, ParticipantMatchData } from "../../../database/models";
import {
  extractParticipantsInfos,
  extractParticipantsStats,
  mergeInfosAndStats,
} from "../utils";

export async function retrieveMatchesData(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { region, account } = res.locals;

    const matchList = await riot(region).getMatchListByPuuid(account.puuid);

    let matchesData: ParticipantMatchData[] = [];

    for (const matchId of matchList) {
      const isMatchStored = await Game.exists(matchId);

      if (!isMatchStored) {
        const matchInfos = await riot(region).getMatchInfosByMatchId(matchId);

        const participantsInfos = await extractParticipantsInfos(matchInfos);

        const matchTimeline = await riot(region).getMatchTimelineByMatchId(
          matchId
        );

        const participantsStats = await extractParticipantsStats(matchTimeline);

        const participantMatchData = await mergeInfosAndStats(
          participantsInfos,
          participantsStats,
          account.puuid
        );

        matchesData.push(participantMatchData);
      } else {
        const matchData: any = await GameInfo.getGameStatsByPuuid(
          matchId,
          account.puuid
        );

        matchesData.push(matchData);
      }
    }

    res.json(matchesData);
  } catch (err) {
    next(err);
  }
}
