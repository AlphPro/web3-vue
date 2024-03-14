import { connector as desktop } from "../connectors/desktopWalletConnect";
import { connector as mobile } from "../connectors/mobileWalletConnect";
import { connector as injected } from "../connectors/injected";
import { connector as qrcode } from "../connectors/qrCodeWalletConnect";

import type { ConnectionOptions } from "../connectors/types";
import { type Account, useAccount } from "./useAccount";
import { useProvider } from "./useProvider";
import type { ConnectorId } from "../connectors/constants";

function getConnector(connector: ConnectorId) {
  switch (connector) {
    case "injected":
      return injected;
    case "walletConnect":
      return qrcode;
    case "desktopWallet":
      return desktop;
    case "mobileWallet":
      return mobile;
  }
}

const onConnectCallbacks: Set<() => Promise<void> | void> = new Set();
function onConnect(callback: () => Promise<void> | void) {
  onConnectCallbacks.add(callback);
}

const onDisconnectCallbacks: Set<() => Promise<void> | void> = new Set();
function onDisconnect(callback: () => Promise<void> | void) {
  onDisconnectCallbacks.add(callback);
}

export function useConnect() {
  const { account, setAccount, clearAccount, fetchBalances } = useAccount();
  const { getProvider, setProvider, clearProvider } = useProvider();
  const connect = async (
    id: ConnectorId,
    options: Partial<ConnectionOptions>
  ) => {
    console.log(`Connecting With ${id} connector`);
    console.log({ options });
    const results = await getConnector(id).connect({
      networkId: options?.networkId as "mainnet" | "testnet" | "devnet", // fix unavailable undefined
      addressGroup: options?.addressGroup,
      keyType: "default",
      onConnected: () => {},
      onDisconnected: () => {
        Promise.allSettled(Array.from(onDisconnectCallbacks).map((cb) => cb()));
      },
    });

    if (results?.success) {
      localStorage.setItem("alephium:connectorId", id);
      setAccount(results.account as Account);
      setProvider(results.provider);
      Promise.allSettled(Array.from(onConnectCallbacks).map((cb) => cb()));
      fetchBalances();
      return results;
    }
  };

  const disconnect = async () => {
    const provider = getProvider();
    const connectorId = localStorage.getItem("alephium:connectorId");

    if (connectorId && provider) {
      await getConnector(connectorId as ConnectorId).disconnect(provider);
    }

    clearAccount();
    clearProvider();
  };

  const autoConnect = async (options: Partial<ConnectionOptions>) => {
    const connectorId = localStorage.getItem("alephium:connectorId");
    // don't log in if already logged in, or not previously logged in
    if (connectorId && account.address) {
      // no auto connection available
      return;
    }
    console.log(`AutoConnecting With ${connectorId} connector`);
    const results = await getConnector(connectorId as ConnectorId).autoConnect({
      networkId: options?.networkId as "mainnet" | "testnet" | "devnet", // fix unavailable undefined
      addressGroup: options?.addressGroup,
      keyType: "default",
      onConnected: () => {},
      onDisconnected: () => {
        Promise.allSettled(Array.from(onDisconnectCallbacks).map((cb) => cb()));
      },
    });

    if (results?.success) {
      setAccount(results.account as Account);
      setProvider(results.provider);
      Promise.allSettled(Array.from(onConnectCallbacks).map((cb) => cb()));
      fetchBalances();
      return results;
    }
  };

  return {
    connect,
    disconnect,
    autoConnect,
    onConnect,
    onDisconnect,
  };
}
