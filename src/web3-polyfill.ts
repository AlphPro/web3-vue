// biome-ignore lint/style/useNodejsImportProtocol: @alephium/web3 polyfill
import { Buffer } from "buffer";
globalThis.Buffer = Buffer;
