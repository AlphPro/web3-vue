<script setup lang="ts">
  import {
    AlephiumConnectionProvider,
    AlephiumConnect,
    useAccount
  } from "./";

  const { account } = useAccount()
</script>

<template>
  <AlephiumConnectionProvider :autoConnect="true" :group="0" network="mainnet">
    <AlephiumConnect v-slot="{ isConnected, connectExtension, connectDesktop, disconnect }">
      <template v-if="!isConnected">
        <button @click="connectExtension">Extension</button>
        <button @click="connectDesktop">Desktop</button>
      </template>
      <button v-else @click="disconnect">Disconnect</button>
    </AlephiumConnect>

    {{ account.address }}
  </AlephiumConnectionProvider>
</template>
