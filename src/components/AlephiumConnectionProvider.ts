import { createAlephium, alephiumSymbol } from "../AlephiumConnector";
import { defineComponent, provide } from "vue";
import { getOptions } from "../options";

export default defineComponent({
  props: {
    group: {
      type: Number,
      default: undefined,
    },

    network: {
      type: String,
      default: undefined,
    },

    autoConnect: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, ctx) {
    const options = getOptions();

    const connectOptions = {
      group: props.group ?? options.group,
      network:
        (props.network as "mainnet" | "testnet" | "devnet" | undefined) ??
        options.network,
    };
    const alephium = createAlephium(connectOptions);

    if (props.autoConnect ?? options.autoConnect) {
      alephium.connection.autoConnect();
    }

    provide(alephiumSymbol, alephium);

    return () => ctx.slots.default?.();
  },
});
