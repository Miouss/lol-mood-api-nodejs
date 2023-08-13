import { Request, Response, NextFunction } from "express";

export async function collectMatchInfoData(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { matches } = res.locals;

    if (!matches) return next();
    
    let matchesInfosSortedByMatch: any = {};
    
    for(const [matchId, matchData] of Object.entries(matches)) {
      const matchInfosSorted: any[] = [];

      (matchData as any).info.participants.forEach((participant: any) => {
        const itemsIds = convertRepetitivesFields(participant, 0, "item");
        const summonersIds = convertRepetitivesFields(
          participant,
          1,
          "summoner",
          "Id"
        );

        const [primaryStyle, subStyle] = participant.perks.styles;
        const runesTree = primaryStyle.selections.concat(subStyle.selections);

        const runesIds = runesTree.map((rune: any) => rune.perk);

        const stylesIds = {
          primary: primaryStyle.style,
          sub: subStyle.style,
        };

        const statsMods = Object.keys(participant.perks.statPerks);

        const {
          gameId,
          puuid,
          championId,
          championName,
          lane,
          win,
          kills,
          deaths,
          assists,
        } = participant;
       
        matchInfosSorted.push({
          gameId,
          puuid,
          championId,
          championName,
          lane,
          win,
          kills,
          deaths,
          assists,
          ...convertArrayToObj(itemsIds, "itemId"),
          ...convertArrayToObj(summonersIds, "summonerId"),
          ...convertArrayToObj(runesIds, "runeId"),
          stylesIds,
          ...convertArrayToObj(statsMods, "statsModId"),
        });
      });

      matchesInfosSortedByMatch[matchId] = matchInfosSorted;
    };

    res.locals.matchesInfosSortedByMatch = matchesInfosSortedByMatch;

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}

function convertRepetitivesFields(
  origin: any,
  startId: number,
  prefix: string,
  suffix: string = ""
) {
  let fieldFound = true;
  let fields: any = [];

  while (fieldFound) {
    const value = origin[`${prefix}${startId}${suffix}`];

    if (value) {
      fields.push(value);
      startId++;
    } else {
      fieldFound = false;
    }
  }

  return fields;
}

function convertArrayToObj(array: any[], key: string) {
  const obj: any = {};

  let i = 0;

  for (const item of array) {
    obj[`${key}${i}`] = item;
    i++;
  }

  return obj;
}
