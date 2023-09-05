import { riot } from "../utils";

export async function getUpToDateAccount(host: string, summonerName: string) {
  const upToDateAccount = await riot(host).getSummonerByName(summonerName);

  delete upToDateAccount.revisionDate;
  delete upToDateAccount.accountId;

  return upToDateAccount;
}
