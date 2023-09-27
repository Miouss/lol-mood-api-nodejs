import fetch, { HeadersInit } from "node-fetch";
import { MatchInfo, MatchTimeline, Rank, PartialAccount } from "../types";

const DOMAIN = ".api.riotgames.com/lol/";
const ACCOUNT = "summoner/v4/summoners/by-name";
const RANK = "league/v4/entries/by-summoner";
const MATCHES = [
  "match/v5/matches/by-puuid",
  "ids?start=0&count=",
  "&queue=420",
];
const MATCH_TIMELINE = ["match/v5/matches", "timeline"];
const MATCH_INFO = "match/v5/matches";

export function riot(host: string) {
  return {
    getSummonerByName: async (summonerName: string) =>
      await getRequest<PartialAccount>(endpoint(host, ACCOUNT, summonerName)),
    getSummonerRankById: async (summonerId: string) =>
      await getRequest<Rank[]>(endpoint(host, RANK, summonerId)),
    getMatchListByPuuid: async (puuid: string, count: string = "10") =>
      await getRequest<string[]>(
        endpoint(host, MATCHES[0], puuid, MATCHES[1] + count + MATCHES[2])
      ),
    getMatchTimelineByMatchId: async (matchId: string) =>
      await getRequest<MatchTimeline>(
        endpoint(host, MATCH_TIMELINE[0], matchId, MATCH_TIMELINE[1])
      ),
    getMatchInfosByMatchId: async (matchId: string) =>
      await getRequest<MatchInfo>(endpoint(host, MATCH_INFO, matchId)),
  };
}

function endpoint(host: string, ...paths: string[]) {
  return `https://${host}${DOMAIN}${paths.join("/")}`;
}

async function getRequest<T>(url: string): Promise<T> {
  const options = createRiotOptions();

  const response = await fetch(url, options);

  if (!response.ok) {
    const errMsg = errMsgs[response.status] || "An unknown error occurred.";
    throw new Error(errMsg);
  }

  const data = await response.json();

  return data as T;
}

const errMsgs: Record<number, string> = {
  429: "You reach the rate limit of the Riot API. Please try again in 3 minutes after the cooldown is refreshed.",
  403: "Your API key is invalid. Please check the API key and try again.",
};

function createRiotOptions() {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Riot-Token": process.env.API_KEY as string,
  };

  return {
    headers,
  };
}
