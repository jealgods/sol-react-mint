"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import { TOKEN_CONSTANTS } from "../../constants/token";

const TradePage = () => {
  const { publicKey } = useWallet();
  const [tokenAmount, setTokenAmount] = useState("");
  const [usdAmount, setUsdAmount] = useState("");
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [currentPrice] = useState(TOKEN_CONSTANTS.INITIAL_PRICE_USD);

  const updateAmounts = (value: string, type: "token" | "usd") => {
    const numValue = Math.max(0, parseFloat(value) || 0);

    if (type === "token") {
      setTokenAmount(numValue.toString());
      setUsdAmount((numValue * currentPrice).toFixed(6));
    } else {
      setUsdAmount(numValue.toString());
      setTokenAmount((numValue / currentPrice).toFixed(0));
    }
  };

  const handleTrade = async () => {
    if (!publicKey || !tokenAmount) return;

    const numTokens = parseFloat(tokenAmount);
    if (numTokens < TOKEN_CONSTANTS.MINIMUM_TRADE_AMOUNT) {
      alert(
        `Minimum trade amount is ${TOKEN_CONSTANTS.MINIMUM_TRADE_AMOUNT} tokens`
      );
      return;
    }

    try {
      // Implement your token trading logic here
      console.log(`${action} tokens: ${tokenAmount} (${usdAmount} USD)`);
    } catch (error) {
      console.error("Trade failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-4">
            <Image
              src="/images/longlifecoin.svg"
              alt={`${TOKEN_CONSTANTS.NAME} Logo`}
              width={48}
              height={48}
              priority
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                {TOKEN_CONSTANTS.NAME} ({TOKEN_CONSTANTS.SYMBOL})
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Current Price: ${currentPrice.toFixed(6)} USD per{" "}
                {TOKEN_CONSTANTS.SYMBOL}
              </p>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <WalletMultiButton className="!w-full sm:!w-auto" />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Supply</p>
              <p className="font-mono">
                {TOKEN_CONSTANTS.TOTAL_SUPPLY.toLocaleString()}{" "}
                {TOKEN_CONSTANTS.SYMBOL}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pool Liquidity</p>
              <p className="font-mono">
                ${TOKEN_CONSTANTS.POOL_LIQUIDITY_USD.toLocaleString()} USD
              </p>
            </div>
          </div>
        </div>

        {publicKey ? (
          <div className="space-y-6">
            <div className="flex gap-4">
              <button
                className={`flex-1 py-2 rounded ${
                  action === "buy" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setAction("buy")}
              >
                Buy
              </button>
              <button
                className={`flex-1 py-2 rounded ${
                  action === "sell" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setAction("sell")}
              >
                Sell
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {TOKEN_CONSTANTS.SYMBOL} Amount
                </label>
                <input
                  type="number"
                  value={tokenAmount}
                  onChange={(e) => updateAmounts(e.target.value, "token")}
                  className="w-full p-2 border rounded"
                  placeholder="Enter token amount"
                  min="0"
                  step="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  USD Amount
                </label>
                <input
                  type="number"
                  value={usdAmount}
                  onChange={(e) => updateAmounts(e.target.value, "usd")}
                  className="w-full p-2 border rounded"
                  placeholder="Enter USD amount"
                  min="0"
                  step="0.000001"
                />
              </div>

              <button
                onClick={handleTrade}
                disabled={
                  !tokenAmount ||
                  parseFloat(tokenAmount) < TOKEN_CONSTANTS.MINIMUM_TRADE_AMOUNT
                }
                className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50"
              >
                {action === "buy" ? "Buy Tokens" : "Sell Tokens"}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Minimum trade amount:{" "}
                {TOKEN_CONSTANTS.MINIMUM_TRADE_AMOUNT.toLocaleString()}{" "}
                {TOKEN_CONSTANTS.SYMBOL}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Please connect your wallet to start trading
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradePage;
