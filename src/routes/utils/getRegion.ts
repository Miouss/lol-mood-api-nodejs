export function getRegion(regionCode: string) {
  const regionInfo = regionMap[regionCode];

  if (!regionInfo) throw new Error("Invalid region code");

  return {
    host: regionInfo.host,
    region: regionInfo.region,
  };
}

enum Host {
  EUNE = "eun1",
  EUW = "euw1",
  NA = "na1",
  BR = "br1",
  LAN = "la1",
  LAS = "la2",
  KR = "kr",
  RU = "ru",
  JP = "jp1",
}

enum Region {
  EU = "europe",
  NA = "americas",
  ASIA = "asia",
}

type RegionInfo = {
  host: Host;
  region: Region;
};

const regionMap: Record<string, RegionInfo> = {
  eune: regionObj(Host.EUNE, Region.EU),
  euw: regionObj(Host.EUW, Region.EU),
  na: regionObj(Host.NA, Region.NA),
  br: regionObj(Host.BR, Region.NA),
  lan: regionObj(Host.LAN, Region.ASIA),
  las: regionObj(Host.LAS, Region.ASIA),
  kr: regionObj(Host.KR, Region.ASIA),
  ru: regionObj(Host.RU, Region.ASIA),
  jp: regionObj(Host.JP, Region.ASIA),
};

function regionObj(host: Host, region: Region) {
  return {
    host,
    region,
  };
}
