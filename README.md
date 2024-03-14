# Alephium Web3-Vue by [Alph.Pro](https://alph.pro)

> `@alphpro/web3-vue` is a series of renderless components and hooks to provide easy access to the Alephium blockchain

## Install

```sh
# install library
bun add @alphpro/web3-vue

# install peer dependencies
bun add \
  @alephium/web3 \
  @alephium/walletconnect-provider \
  @alephium/get-extension-wallet \
  @alephium/walletconnect-qrcode-modal
```

## Setup

Simply import components as needed from `@alphpro/web3-vue` or initialize the plugin to install the components globally

```html
<script setup lang="ts">
  // use locally in your component
  import {
    AlephiumConnectionProvider,
    AlephiumConnect,
    AlephiumExecute,
  } from "@alphpro/web3-vue";
</script>
```

~ or ~

```ts
// main.ts
import AlphProWeb3 from "@alphpro/web3-vue";

createApp(App)
  .use(AlphProWeb3) // install components globally
  .mount("#app");
```

## Components

### Alephium Provider

Alephium Provider should be placed on the furthest edge of your app that you will be using any Alephium features. For most dapps this means wrap your entire app with it for simplicity. Its responsible for resuming with auto-connect, and providing all children components with Alephium functionality

```html
<template>
  <AlephiumConnectionProvider :autoconnect="true" :group="0" network="mainnet">
    <!-- Your App -->
  </AlephiumConnectionProvider>
</template>
```

### Alephium Connect

Alephium Connect can be used anywhere, any time (as long as its a child of AlephiumConnectionProvider). Through its slots API it provides connect, disconnect functionality

Now Add a Connect Button

```html
<template>
  <AlephiumConnect
    v-slot="{ isConnected, connectExtension, connectDesktop, disconnect }"
  >
    <template v-if="!isConnected">
      <button @click="connectExtension">Extension</button>
      <button @click="connectDesktop">Desktop</button>
    </template>
    <button v-else @click="disconnect">Disconnect</button>
  </AlephiumConnect>
</template>
```

It also provides easy access to the currently connected account

```html
<template>
  <AlephiumConnect v-slot="{ account, balances }">
    <div>Hello {{ account.address }}</div>
    <div>Balance: {{ balances.balance }}</div>
  </AlephiumConnect>
</template>
```

How you want to show your connect options is completely up to you, one common pattern is to have the 'Connect' button to simply open a modal, and this modal is where the actual connection takes place. Several helper functions are available to make it easy to create such a modal.

```html
<template>
  <AlephiumConnect
    v-slot="{ 
        connectExtension, 
        connectMobile, 
        connectDesktop, 
        connectWalletConnect 
    }"
  >
    <ul>
      <li><button @click="connectExtension">Extension Wallet</button></li>
      <li><button @click="connectMobile">Mobile Wallet</button></li>
      <li><button @click="connectDesktop">Desktop Wallet</button></li>
      <li><button @click="connectWalletConnect">Wallet Connect</button></li>
    </ul>
  </AlephiumConnect>
</template>
```

### Alephium Execute

When creating a dApp, execution of a TxScript is probably something you will encounter. Using the AlephiumExecute component you can provide the generated Artifact & Options and will have access to a simple `execute` function. Managing signer/provider will be handled behind the scenes. a set of events will be emitted so that you can easily track transaction status

```html
<script setup>
  import { Withdraw } from "../artifacts";

  const fields = {
    initialFields: {},
    attoAlphAmount: DUST_AMOUNT,
  };

  function handleNewTransaction(txId: string) {
    //
  }
  function handleConfirmedTransaction(txId: string) {
    //
  }
  function handleFailedTransaction(txId: string) {
    //
  }
</script>

<template>
  <AlephiumExecute
    :txScript="Withdraw"
    :fields="fields"
    v-slot="{ execute }"
    @txInitiated="handleNewTransaction"
    @txConfirmed="handleConfirmedTransaction"
    @txFailed="handleFailedTransaction"
  >
    <button @click="execute">Withdraw</button>
  </AlephiumExecute>
</template>
```

## Hooks

If you require access to the blockchain from within `<script />` tags, a set of hooks are also provided for more raw access. These are what power the above components and are capable of managing more advanced use-cases when needed.

```ts
import { useConnect, useAccount, useProvider } from "@alphpro/web3-vue";

const { connect, disconnect, autoConnect } = useConnect();
const { account, balances, fetchBalances } = useAccount();
const { getProvider } = useProvider();
```

## Tips & Troubleshooting

### Balances

1. Balances will be fetched automatically on connection, and refreshed after every successful transaction. Generally you shouldn't need to manually fetch balances, however in some scenarios it may be desired and can be done by simply calling `fetchBalances` from `useAccount()`

2. access to the reactive `provider` is available from `useProvider()` however due to management of vue internals, in some cases this will cause issues. The solution is to call the `getProvider()` getter on demand when needed, and this will return the users untouched provider which you can sign transactions manually for example.
