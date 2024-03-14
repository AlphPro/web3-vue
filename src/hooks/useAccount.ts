import {
  type Account as Web3Account,
  type NetworkId,
  addressFromContractId,
} from "@alephium/web3";
import { reactive } from "vue";
import { useProvider } from "./useProvider";

interface Balance {
  balance: bigint;
  lockedBalance: bigint;
  tokenBalances: {
    token: string;
    balance: bigint;
  }[];
  lockedTokenBalances: {
    token: string;
    balance: bigint;
  }[];
}

const createEmptyBalances = (): Balance => ({
  balance: 0n,
  lockedBalance: 0n,
  tokenBalances: [],
  lockedTokenBalances: [],
});

export type Account = Omit<Web3Account, "networkId" | "group"> & {
  networkId: NetworkId | undefined;
  group: number | undefined;
};

const account = reactive<Account>({
  networkId: undefined,
  keyType: "default",
  group: undefined,
  address: "",
  publicKey: "",
});

const balances = reactive<Balance>(createEmptyBalances());

function setAccount(value: Account) {
  account.networkId = value.networkId;
  account.address = value.address;
  account.publicKey = value.publicKey;
  account.keyType = value.keyType;
  account.group = value.group;
}

function clearAccount() {
  Object.assign(account, { address: "", publicKey: "" });
  Object.assign(balances, createEmptyBalances());
}

async function fetchBalances() {
  const { provider } = useProvider();
  const results =
    await provider.value?.nodeProvider.addresses.getAddressesAddressBalance(
      account.address
    );

  balances.balance = BigInt(results?.balance || 0);
  balances.lockedBalance = BigInt(results?.lockedBalance || 0);
  balances.tokenBalances = (results?.tokenBalances || []).map((a) => ({
    token: addressFromContractId(a.id),
    balance: BigInt(a.amount),
  }));
  balances.lockedTokenBalances = (results?.lockedTokenBalances || []).map(
    (a) => ({
      token: addressFromContractId(a.id),
      balance: BigInt(a.amount),
    })
  );
}
export function useAccount() {
  return { account, setAccount, clearAccount, balances, fetchBalances };
}
