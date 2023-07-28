import { Response, NextFunction } from "express";
import { getRequest, postRequest } from "../../utils/requests";

export async function getAccount(req: any, _: Response, next: NextFunction) {
  try {
    const server = req.get("host");
    const { host } = req;

    const riotApiEndpointGetAccount = `https://${host}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${req.query.summonerName}`;
    const updatedAccount: any = await getRequest(
      riotApiEndpointGetAccount,
      true
    );

    const riotApiEndpointGetRank = `https://${host}.api.riotgames.com/lol/league/v4/entries/by-summoner/${updatedAccount.id}`;
    const updatedRank: any = await getRequest(riotApiEndpointGetRank, true);

    updatedRank.forEach((element: any) => {
      if (element["queueType"] === "RANKED_SOLO_5x5") {
        const { tier, rank, leaguePoints, wins, losses } = element["queueType"];

        Object.assign(updatedRank, {
          rank: tier,
          tier: rank,
          lp: leaguePoints,
          games: wins + losses,
          wins,
        });
      }
    });

    const dbApiEndpointGetAccount = `${server}/api/Controller/AccountController.php?action=read&puuid=${updatedAccount.puuid}`;

    const storedAccount: any = await getRequest(
      dbApiEndpointGetAccount,
      false,
      false
    );

    const isAccountFound = storedAccount || updatedAccount;
    const isAccountStored = !!storedAccount;
    const hasRankedGames = !!updatedRank;

    if (!isAccountFound)
      throw new Error("No account found for this summoner name");
    if (!hasRankedGames)
      throw new Error("No ranked games found for this account");

    if (isAccountStored) {
      const updatedData: any = [];

      const { name, profileIconId, summonerLevel } = updatedAccount;
      const {
        name: storedName,
        profile_icon_id: storedProfileIconId,
        level: storedLevel,
      } = storedAccount;

      const hasChangedName = name !== storedName;
      const hasChangedProfileIcon = profileIconId !== storedProfileIconId;
      const hasChangedLevel = summonerLevel !== storedLevel;

      const hasAtLeastOneChange =
        hasChangedName || hasChangedProfileIcon || hasChangedLevel;

      if (hasAtLeastOneChange) {
        if (hasChangedName) updatedData["name"] = name;

        if (hasChangedProfileIcon) updatedData["profileIconId"] = profileIconId;

        if (hasChangedLevel) updatedData["summonerLevel"] = summonerLevel;

        updatedData["puuid"] = updatedAccount["puuid"];

        await postRequest("Account", "update", updatedData);
      }
    } else {
      postRequest("Account", "create", updatedAccount);
    }

    const account = await getRequest(dbApiEndpointGetAccount);
    return account;
  } catch (err) {
    next(err);
  }
}
