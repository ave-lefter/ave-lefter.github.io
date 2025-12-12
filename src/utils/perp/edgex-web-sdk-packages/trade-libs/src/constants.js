export const ifOdyssey = false;
export const ifCountdownMode = false;
export const INFURA_KEY = "9aa3d95b3bc440fa88ea12eaa4456161";
export const biconomyKey = {
  // '1': 'oMuReokRP.7e12ee4c-2d1b-4ad0-a072-63d8d4e1733b',
  5: "IZfGOXJkn.a4c0849e-d50b-4fa1-9aec-0a0ab38f2b2b",
  56: "GrZn535fk.0b516e77-5d12-4906-a428-a19698b321e3",
  137: "UXOATu8i_.bd00c504-4ae7-4a53-b2f4-8f5cc5f208b7",
  42161: "53ljOXLD_.b206f5cf-35d3-4e18-b4eb-d78ecc2748bc",
};
export const gasLessChain = Object.keys(biconomyKey).map((i) => +i);
export var SupportedChainId;
(function (SupportedChainId) {
  SupportedChainId[(SupportedChainId["MAINNET"] = 1)] = "MAINNET";
  SupportedChainId[(SupportedChainId["GOERLI"] = 5)] = "GOERLI";
  SupportedChainId[(SupportedChainId["BNB"] = 56)] = "BNB";
  SupportedChainId[(SupportedChainId["BNB_TEST"] = 97)] = "BNB_TEST";
  SupportedChainId[(SupportedChainId["POLYGON"] = 137)] = "POLYGON";
  SupportedChainId[(SupportedChainId["POLYGON_MUMBAI"] = 80001)] = "POLYGON_MUMBAI";
  SupportedChainId[(SupportedChainId["ARBITRUM_ONE"] = 42161)] = "ARBITRUM_ONE";
  SupportedChainId[(SupportedChainId["ARBITRUM_RINKEBY"] = 421611)] = "ARBITRUM_RINKEBY";
  SupportedChainId[(SupportedChainId["Arbitrum_Goerli"] = 421613)] = "Arbitrum_Goerli";
  SupportedChainId[(SupportedChainId["Optimism"] = 10)] = "Optimism";
  SupportedChainId[(SupportedChainId["Optimism_Goerli"] = 420)] = "Optimism_Goerli";
  SupportedChainId[(SupportedChainId["AVAX"] = 43114)] = "AVAX";
  SupportedChainId[(SupportedChainId["AVAX_FUJI"] = 43113)] = "AVAX_FUJI";
  SupportedChainId[(SupportedChainId["MANTLE"] = 5000)] = "MANTLE";
  SupportedChainId[(SupportedChainId["MANTLE_TESTNET"] = 5001)] = "MANTLE_TESTNET";
})(SupportedChainId || (SupportedChainId = {}));
export const rpcUrl = {
  [SupportedChainId.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.GOERLI]: `https://goerli.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.BNB]: "https://bsc-dataseed4.ninicoin.io",
  [SupportedChainId.BNB_TEST]: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  [SupportedChainId.POLYGON]: "https://rpc-mainnet.maticvigil.com",
  [SupportedChainId.POLYGON_MUMBAI]:
    "https://naughty-blackwell:waffle-sprawl-math-used-ripple-snarl@nd-311-035-380.p2pify.com",
  [SupportedChainId.ARBITRUM_ONE]: "https://arb1.arbitrum.io/rpc",
  [SupportedChainId.Arbitrum_Goerli]: "https://goerli-rollup.arbitrum.io/rpc",
  [SupportedChainId.Optimism]: "https://mainnet.optimism.io",
  [SupportedChainId.Optimism_Goerli]: "https://goerli.optimism.io",
  [SupportedChainId.AVAX]: "https://avalanche-c-chain.publicnode.com",
  [SupportedChainId.AVAX_FUJI]: "https://api.avax-test.network/ext/bc/C/rpc",
  [SupportedChainId.MANTLE]: "https://rpc.mantle.xyz",
};

export const values = {
  CNY: "￥",
  UST: "$",
  digits: {
    USDC: 6,
    USDT: 6,
    USD: 6,
  },
};
