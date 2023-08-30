import { Request, Response, NextFunction } from "express";
import {
  createParticipantsStats,
  isEventTypeHandled,
  participant,
  EventType,
} from "../utils";
import { Locals } from "../types";

export async function extractMatchStats(
  _: Request,
  res: Response<any, Locals>,
  next: NextFunction
) {
  try {
    const { matchTimeline } = res.locals;

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

    res.locals.participantsStats = participantsStats;

    next();
  } catch (err) {
    next(err);
  }
}
