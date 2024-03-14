import { reactive } from "vue";

export interface AlephiumOptions {
  autoConnect?: boolean;
  group?: number;
  network?: "mainnet" | "testnet" | "devnet";
}
let options = reactive<AlephiumOptions>({});
export const getOptions = () => options;
export const setOptions = (opts: Partial<AlephiumOptions>) => {
  options = { ...options, ...opts };
};
