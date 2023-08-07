const RIOT_API = {
  ACCOUNT: ".api.riotgames.com/lol/summoner/v4/summoners/by-name/",
  RANK: ".api.riotgames.com/lol/league/v4/entries/by-summoner/",
};

export const getSummonerByName = (summonerName: string, host: string) =>
  `https://${host}${RIOT_API.ACCOUNT}${summonerName}`;

export const getSummonerRank = (summonerId: string, host: string) =>
  `https://${host}${RIOT_API.RANK}${summonerId}`;
