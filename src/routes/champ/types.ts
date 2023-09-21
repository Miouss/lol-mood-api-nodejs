import { ParticipantMatchDataResponse } from "../../database/models";

export interface Locals {
  games: ParticipantMatchDataResponse[];
  runes: unknown;
  items: unknown;
  mostPlayedStatsMods: unknown;
  skillsOrder: unknown;
  evolvesOrder: unknown;
}
