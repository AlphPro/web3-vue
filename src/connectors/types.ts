import type { AlephiumWindowObject } from "@alephium/get-extension-wallet";
import type { WalletConnectProvider } from "@alephium/walletconnect-provider";
import type { KeyType, NetworkId } from "@alephium/web3";
import type { CommonProvider } from "./utils";
import type { Account } from "../hooks/useAccount";

export type IntersectedSignerProvider =
  | WalletConnectProvider
  | AlephiumWindowObject;

export interface ConnectResultSuccess {
  success: true;
  account: Account;
  provider: CommonProvider;
}

export interface ConnectResultFailure {
  success: false;
  account: undefined;
  provider: undefined;
}
export type ConnectResult = ConnectResultSuccess | ConnectResultFailure;

export interface ConnectionOptions {
  networkId: NetworkId;
  addressGroup?: number;
  keyType: KeyType;
  onDisconnected: (...args: unknown[]) => void;
  onConnected: (...args: unknown[]) => void;
}

export interface Connector {
  connect: (options: ConnectionOptions) => Promise<ConnectResult | undefined>;
  autoConnect: (
    options: ConnectionOptions
  ) => Promise<ConnectResult | undefined>;
  disconnect: (provider: CommonProvider) => Promise<void>;
}
