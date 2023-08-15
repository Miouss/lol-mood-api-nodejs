import { Request, Response, NextFunction } from "express";

export async function extractMatchesInfos(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { matches } = res.locals;

    if (!matches) return next();

    let matchesInfosSortedByMatch: any = {};

    for (const [matchId, matchData] of Object.entries(matches)) {
      const matchInfosSorted: any[] = [];

      (matchData as any).info.participants.forEach((participant: any) => {
        const multipleData = multipleDataObj(participant);

        const [primaryStyle, subStyle] = participant.perks.styles;

        const stylesIds = {
          primary: primaryStyle.style,
          sub: subStyle.style,
        };

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
          stylesIds,
          ...convertDataForDB(multipleData),
        });
      });

      matchesInfosSortedByMatch[matchId] = matchInfosSorted;
    }

    res.locals.matchesInfosSortedByMatch = matchesInfosSortedByMatch;

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}
function multipleDataObj(participant: any) {
  const createData = (data: any, field: string) => ({
    data,
    field,
  });

  const extractRunes = () => {
    const [primaryStyle, subStyle] = participant.perks.styles;
    const runesTree = primaryStyle.selections.concat(subStyle.selections);

    return createData(
      runesTree.map((rune: any) => rune.perk),
      "runeId"
    );
  };

  const extractItems = () =>
    createData(convertRepetitivesFields(participant, 0, "item"), "itemId");

  const extractSummoners = () =>
    createData(
      convertRepetitivesFields(participant, 1, "summoner", "Id"),
      "summonerId"
    );

  const extractStatsMods = () =>
    createData(Object.keys(participant.perks.statPerks), "statsModId");

  return [
    extractItems(),
    extractStatsMods(),
    extractSummoners(),
    extractRunes(),
  ];
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

function convertDataForDB(multipleData: DataObj[]) {
  let dataObj: any = {};

  multipleData.forEach((singleData) => {
    dataObj = {
      ...dataObj,
      ...convertArrayToObj(singleData.data, singleData.field),
    };
  });

  return dataObj;
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

interface DataObj {
  data: any[];
  field: string;
}
