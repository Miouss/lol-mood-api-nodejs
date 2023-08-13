import fetch, { HeadersInit } from "node-fetch";

const DOMAIN = ".api.riotgames.com/lol/";
const ACCOUNT = "summoner/v4/summoners/by-name";
const RANK = "league/v4/entries/by-summoner";
const MATCHES = ["match/v5/matches/by-puuid", "ids?start=0&count=3"];
const MATCH_STATS = ["match/v5/matches", "timeline"];
const MATCH_INFO = "match/v5/matches";

export function riot(host: string) {
  return {
    getSummonerByName: async (summonerName: string) =>
      await getRequest(endpoint(host, ACCOUNT, summonerName)),
    getSummonerRankById: async (summonerId: string) =>
      await getRequest(endpoint(host, RANK, summonerId)),
    getMatchListByPuuid: async (puuid: string) =>
      await getRequest(endpoint(host, MATCHES[0], puuid, MATCHES[1])),
    getMatchStatsByMatchId: async (matchId: string) =>
      await getRequest(endpoint(host, MATCH_STATS[0], matchId, MATCH_STATS[1])),
    getMatchInfoByMatchId: async (matchId: string) =>
      await getRequest(endpoint(host, MATCH_INFO, matchId)),
  };
}

function endpoint(host: string, ...paths: string[]) {
  return `https://${host}${DOMAIN}${paths.join("/")}`;
}

async function getRequest(url: string) {
  const options = createRiotOptions();

  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Request to ${url} failed with status ${response.status}`);

  const data = await response.json();

  return data;
}

function createRiotOptions() {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Riot-Token": process.env.API_KEY as string,
  };

  return {
    method: "GET",
    headers,
  };
}
