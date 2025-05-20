export const TOKEN_CONSTANTS = {
  NAME: "LongLifeCoin",
  SYMBOL: "LLC",
  MINT_ADDRESS: "YOUR_TOKEN_MINT_ADDRESS", // Replace with your actual token mint address
  TOTAL_SUPPLY: 1_000_000_000, // 10^9
  POOL_LIQUIDITY_USD: 1_000_000, // $1000
  INITIAL_PRICE_USD: 0.000001, // 10^-6 $
  TOKEN_DECIMALS: 9,
  MINIMUM_TRADE_AMOUNT: 0, // Minimum tokens per trade
};

export const calculateTokenPrice = (
  poolLiquidityUsd: number,
  totalSupply: number
) => {
  return poolLiquidityUsd / totalSupply;
};

export const calculateTokenAmount = (usdAmount: number, tokenPrice: number) => {
  return usdAmount / tokenPrice;
};

export const calculateUsdAmount = (tokenAmount: number, tokenPrice: number) => {
  return tokenAmount * tokenPrice;
};
