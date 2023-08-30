export interface AccountDB {
    puuid: string;
    name: string;
    level: number;
    profileIconId: number;
    grade: string;
    tier: string;
    lp: number;
    games: number;
    wins: number;
}

export interface AssetDB {
    identifier: number;
}

export interface ChampDB {
    name: string;
}

export interface MatchDB {
    identifier: string;
}

export interface GameInfoDB {
    gameId: number;
    accountId: number;
    champId: number;
    positioningId: number;
    win: boolean;
    kills: number;
    deaths: number;
    assists: number;
    skillsOrder: string;
    evolvesOrder: string;
    primaryStyleId: number;
    subStyleId: number;
    perkId: number;
    runeId0: number;
    runeId1: number;
    runeId2: number;
    runeId3: number;
    runeId4: number;
    statsModId0: number;
    statsModId1: number;
    statsModId2: number;
    summonerId0: number;
    summonerId1: number;
    itemId0?: number;
    itemId1?: number;
    itemId2?: number;
    itemId3?: number;
    itemId4?: number;
    itemId5?: number;
    startItemId0?: number;
    startItemId1?: number;
    startItemId2?: number;
    startItemId3?: number;
    startItemId4?: number;
    startItemId5?: number;
    completedItemId0?: number;
    completedItemId1?: number;
    completedItemId2?: number;
    completedItemId3?: number;
    completedItemId4?: number;
    completedItemId5?: number;
}