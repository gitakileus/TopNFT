export const DEBUG = false;
export const INFURA_ID = "0a639a32ec7345bc87ea49ad0b15b0e6";
export const MAINNET_RPC_URL = `https://mainnet.infura.io/v3/${INFURA_ID}`;
export const TESTNET_RPC_URL = `https://goerli.infura.io/v3/${INFURA_ID}`;
// export const HARDHAT_URL = "http://localhost:8545";

export const DAPP_READONLY_RPC = !DEBUG
  ? "https://rpc.ankr.com/eth"
  : "https://goerli.optimism.io/";
export const NETWORK_ID = !DEBUG ? 0x01 : 0x420;
export const RPC_URL = DAPP_READONLY_RPC;
export const NETWORK_NAME = DEBUG ? "Mainnet" : "Goerli";
export const contractAddress = "0x3634Fa28ecdf029f93f3F645272e53F2a9faebE3";
