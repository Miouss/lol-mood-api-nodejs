import { Request, Response, NextFunction } from "express";
import {
  createParticipantsStats,
  isEventTypeHandled,
  participant,
  EventType,
} from "../../utils";
import {
  MatchesLocals,
  ParticipantStatsTypeByMatch,
} from "../../../types";

export async function extractMatchesTimelines(
  _: Request,
  res: Response<any, MatchesLocals>,
  next: NextFunction
) {
  try {
    const { matchesTimelines } = res.locals;

    let participantsStatsByMatch: ParticipantStatsTypeByMatch = {};

    matchesTimelines.forEach((matchTimeline) => {
      const participantsStats = createParticipantsStats(
        matchTimeline.info.participants!
      );

      for (const frame of matchTimeline.info.frames) {
        for (const event of frame.events) {
          if (!isEventTypeHandled(event.type)) continue;

          const { type, participantId } = event;

          const id = participantId! - 1;

          participant(participantsStats[id]).event(event)[type as EventType]();
        }
      }

      participantsStatsByMatch[matchTimeline.metadata.matchId] =
        participantsStats;
    });

    res.locals.participantsStatsByMatch = participantsStatsByMatch;

    next();
  } catch (err) {
    next(err);
  }
}
