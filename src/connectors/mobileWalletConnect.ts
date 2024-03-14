import {
  type ProviderCallbacks,
  _wcConnect,
  _wcDisconnect,
  _wcAutoConnect,
} from "./walletConnect.utils";

import type { ConnectResult, ConnectionOptions, Connector } from "./types";

const connect = async (
  options: ConnectionOptions,
  callbacks: Partial<ProviderCallbacks> = {}
): Promise<ConnectResult | undefined> => {
  return await _wcConnect(options, {
    ...callbacks,
    onDisplayUri: (uri) => globalThis.window?.open(`${uri}`),
  });
};

export const connector = {
  connect: connect,
  disconnect: _wcDisconnect,
  autoConnect: _wcAutoConnect,
} satisfies Connector;
