import type { AlephiumWindowObject } from "@alephium/get-extension-wallet";
import type { WalletConnectProvider } from "@alephium/walletconnect-provider";
import type {
  NetworkId,
  SignMessageParams,
  SignerProvider,
  SignMessageResult,
  NodeProvider,
} from "@alephium/web3";
import type { Account } from "../hooks/useAccount";

export interface CommonProvider {
  signer: SignerProvider;
  nodeProvider: NodeProvider;
  disconnect: () => Promise<void>;
  signMessage: (params: SignMessageParams) => Promise<SignMessageResult>;
}

export const makeCommonAccount = (
  account: Account,
  networkId: NetworkId | undefined
): Account => {
  if (networkId === undefined) {
    throw new Error("networkId is undefined");
  }
  return {
    ...account,
    networkId:
      "networkId" in account ? account.networkId || networkId : networkId,
  };
};

export const makeCommonProvider = (
  provider: AlephiumWindowObject | WalletConnectProvider
): CommonProvider => {
  if (!provider.nodeProvider) {
    throw new Error("Failed to find node provider");
  }
  return {
    signer: provider,
    nodeProvider: provider.nodeProvider,
    disconnect: () => provider.disconnect(),
    signMessage: (params) => provider.signMessage(params),
  };
};
