import { alephiumSymbol } from "../AlephiumConnector";
import { computed, defineComponent, inject } from "vue";

export default defineComponent({
  setup(_, ctx) {
    const alephium = inject(alephiumSymbol);
    if (!alephium) {
      return () =>
        ctx.slots.default?.({
          account: "",
          isConnected: false,
          connectExtension: () => {},
          connectMobile: () => {},
          connectDesktop: () => {},
          connectWalletConnect: () => {},
          disconnect: () => {},
        });
    }
    const isConnected = computed(() =>
      Boolean(alephium.account.account.address)
    );

    const connectExtension = () => alephium.connection.connect("injected");
    const connectMobile = () => alephium.connection.connect("desktopWallet");
    const connectDesktop = () => alephium.connection.connect("mobileWallet");
    const connectWalletConnect = () =>
      alephium.connection.connect("walletConnect");
    return () =>
      ctx.slots.default?.({
        account: alephium.account,
        isConnected: isConnected.value,
        connectExtension,
        connectMobile,
        connectDesktop,
        connectWalletConnect,
        disconnect: alephium.connection.disconnect,
      });
  },
});
