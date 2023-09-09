import { ParticipantMatchDataResponse } from "../../database/models";

export interface Locals {
  games: ParticipantMatchDataResponse[];
  runesStats: unknown;
  items: unknown;
  mostPlayedStatsMods: unknown;
}
