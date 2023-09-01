import { riot } from "./requests";

export async function getMatches(puuid: string, region: string) {
  return await riot(region).getMatchListByPuuid(puuid);
}
