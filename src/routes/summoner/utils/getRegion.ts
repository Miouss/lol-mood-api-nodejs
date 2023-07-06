export function getRegion(regionCode: string) {
  let host;
  let region;

  switch (regionCode) {
    case "EUNE":
      host = "eun1";
      region = "europe";
      break;
    case "EUW":
      host = "euw1";
      region = "europe";
      break;
    case "NA":
      host = "na1";
      region = "americas";
      break;
    case "BR":
      host = "br1";
      region = "americas";
      break;
    case "LAN":
      host = "la1";
      region = "asia";
      break;
    case "LAS":
      host = "la2";
      region = "asia";
      break;
    case "KR":
      host = "kr";
      region = "asia";
      break;
    case "RU":
      host = "ru";
      region = "asia";
      break;
    case "JP":
      host = "jp1";
      region = "asia";
      break;
  }

  return { host, region };
}
