import { Request, Response, NextFunction } from "express";
import { riot } from "../../../utils/requests";
import {
  createParticipantsStats,
  isEventTypeHandled,
  participant,
  EventType,
} from "../../utils";

export async function extractMatchesStats(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { matchesStats } = res.locals;

    let participantsStatsByMatch: any = {};

    matchesStats.forEach((matchStats: any) => {
      const participantsStats = createParticipantsStats(
        matchStats.info.participants
      );

      for (const frame of matchStats.info.frames) {
        for (const event of frame.events) {
          if (!isEventTypeHandled(event.type)) continue;

          const { type, participantId } = event;

          const id = participantId - 1;

          participant(participantsStats[id]).event(event)[type as EventType]();
        }
      }

      participantsStatsByMatch[matchStats.metadata.matchId] = participantsStats;
    });

    res.locals.participantsStatsByMatch = participantsStatsByMatch;

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}
