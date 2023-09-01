import { Account, StoredAccount } from "../../../database/models";

export async function getStoredAccount(puuid: string) {
  const isStored = await Account.exists(puuid);

  if (!isStored) {
    return undefined;
  }

  const storedAccount = await Account.get(puuid);

  if (!storedAccount) {
    throw new Error("No account found in DB");
  }

  return storedAccount as unknown as StoredAccount;
}
