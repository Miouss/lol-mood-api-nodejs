const regionMap = {
  eune: { host: "eun1", region: "europe" },
  euw: { host: "euw1", region: "europe" },
  na: { host: "na1", region: "americas" },
  br: { host: "br1", region: "americas" },
  lan: { host: "la1", region: "asia" },
  las: { host: "la2", region: "asia" },
  kr: { host: "kr", region: "asia" },
  ru: { host: "ru", region: "asia" },
  jp: { host: "jp1", region: "asia" },
};

export function getRegion(regionCode: RegionCodeType) {
  const regionInfo = regionMap[regionCode];

  if (!regionInfo) {
    throw new Error("Invalid region code");
  }

  return regionInfo;
}

type RegionCodeType = keyof typeof regionMap;
