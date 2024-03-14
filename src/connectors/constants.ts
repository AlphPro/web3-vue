export const connectorIds = [
  "injected",
  "walletConnect",
  "desktopWallet",
  "mobileWallet",
] as const;
export type ConnectorId = (typeof connectorIds)[number];
