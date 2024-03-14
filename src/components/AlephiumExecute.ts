import { type SetupContext, defineComponent } from "vue";
import { useProvider } from "../hooks/useProvider";
import { useAccount } from "../hooks/useAccount";
import type {
  ExecutableScript,
  ExecuteScriptParams,
  Fields,
  SignerProvider,
} from "@alephium/web3";

interface Props<TFields extends Fields> {
  txScript: ExecutableScript<TFields>;
  fields: ExecuteScriptParams<TFields>;
}

interface Emits {
  txInitiated: [txHash: string];
  txConfirmed: [txHash: string];
  txFailed: [error: Error];
}

export default defineComponent(
  <TFields extends Fields>(props: Props<TFields>, ctx: SetupContext<Emits>) => {
    const { getProvider } = useProvider();
    const { fetchBalances } = useAccount();

    async function pollTransaction(txId: string) {
      const provider = getProvider();
      if (!provider) {
        throw new Error("No provider available");
      }

      const result =
        await provider.nodeProvider.transactions.getTransactionsStatus({
          txId,
        });
      if (["TxNotFound", "MemPooled"].includes(result.type)) {
        setTimeout(() => pollTransaction(txId), 1000); // re-check every second
      } else {
        ctx.emit("txConfirmed", txId);
      }
    }

    async function execute() {
      const provider = getProvider();
      if (!provider) {
        throw new Error("No provider available");
      }
      try {
        const result = await props.txScript.execute(
          provider.signer as SignerProvider,
          props.fields
        );
        ctx.emit("txInitiated", result.txId);

        await fetchBalances();

        pollTransaction(result.txId);

        return result;
      } catch (e) {
        ctx.emit("txFailed", e as Error);
      }
    }
    return () => ctx.slots.default?.({ execute });
  },
  {
    props: ["txScript", "fields"],
    emits: ["txInitiated", "txConfirmed", "txFailed"],
  }
);
