import type { Plugin } from "vue";
import { createAlephium, alephiumSymbol } from "./AlephiumConnector";
import { type AlephiumOptions, setOptions } from "./options";
// components
import AlephiumConnectionProvider from "./components/AlephiumConnectionProvider";
import AlephiumConnect from "./components/AlephiumConnect";
import AlephiumExecute from "./components/AlephiumExecute";
import { useAccount } from "./hooks/useAccount.js";
import { useConnect } from "./hooks/useConnect.js";
import { useProvider } from "./hooks/useProvider.js";

export default {
  install(app, _options: Partial<AlephiumOptions> = {}) {
    setOptions(_options);

    // register global components
    app.component("AlephiumConnectionProvider", AlephiumConnectionProvider);
    app.component("AlephiumConnect", AlephiumConnect);
    app.component("AlephiumExecute", AlephiumExecute);

    app.component("alephium-connection-provider", AlephiumConnectionProvider);
    app.component("alephium-connect", AlephiumConnect);
    app.component("alephium-execute", AlephiumExecute);
  },
} satisfies Plugin;

export {
  /** Components */
  AlephiumConnectionProvider,
  AlephiumConnect,
  AlephiumExecute,
  /** Hooks */
  useAccount,
  useConnect,
  useProvider,
  /** Helpers */
  createAlephium,
  alephiumSymbol,
};
