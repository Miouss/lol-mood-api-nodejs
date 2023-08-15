import { Request, Response, NextFunction } from "express";
import { arrayToKeyedObject } from "../../utils";

export async function extractMatchesInfos(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { matchesInfos } = res.locals;

    if (!matchesInfos) return next();

    let participantsInfosByMatch: any = {};

    for (const [matchId, matchData] of Object.entries(matchesInfos)) {
      const matchInfosSorted: any[] = [];

      (matchData as any).info.participants.forEach((participant: any) => {
        const multipleData = multipleDataObj(participant);

        const [primaryStyle, subStyle] = participant.perks.styles;

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
          primaryStyleId: primaryStyle.style,
          subStyleId: subStyle.style,
          perkId: primaryStyle.selections[0].perk,
          ...convertDataForDB(multipleData),
        });
      });

      participantsInfosByMatch[matchId] = matchInfosSorted;
    }

    res.locals.participantsInfosByMatch = participantsInfosByMatch;

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
    runesTree.shift();

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
      ...arrayToKeyedObject(singleData.data, singleData.field),
    };
  });

  return dataObj;
}

interface DataObj {
  data: any[];
  field: string;
}
