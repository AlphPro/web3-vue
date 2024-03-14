import type { InjectionKey } from "vue";
import { useAccount } from "./hooks/useAccount";
import { useConnect } from "./hooks/useConnect";
import { useProvider } from "./hooks/useProvider";
import type { ConnectorId } from "./connectors/constants";
import type { ConnectionOptions } from "./connectors/types";

export const alephiumSymbol = Symbol("alephium") as InjectionKey<
  ReturnType<typeof createAlephium>
>;
interface CreateAlephiumOptions {
  group?: undefined | number;
  network?: undefined | "mainnet" | "testnet" | "devnet";
}
export function createAlephium(options: CreateAlephiumOptions) {
  const connectOptions = {
    addressGroup: options.group,
    networkId: options.network,
  };
  const connection = useConnect();
  const account = useAccount();
  const provider = useProvider();
  return {
    connection: {
      connect: (id: ConnectorId, options: Partial<ConnectionOptions> = {}) =>
        connection.connect(id, { ...connectOptions, ...options }),
      disconnect: connection.disconnect,
      autoConnect: () => connection.autoConnect(connectOptions),
    },
    account,
    provider,
  };
}
