"use client";

import { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { TOKEN_CONSTANTS } from "@/constants/token";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import TradingViewWidget from "@/components/TradingViewWidget";

export default function TradePage() {
  const { publicKey, wallet } = useWallet();
  const [tokenAmount, setTokenAmount] = useState("");
  const [usdAmount, setUsdAmount] = useState("");
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [currentPrice] = useState(1.5);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateAmounts = (value: string, type: "token" | "usd") => {
    const numValue = parseFloat(value) || 0;
    if (type === "token") {
      setTokenAmount(value);
      setUsdAmount((numValue * currentPrice).toFixed(2));
    } else {
      setUsdAmount(value);
      setTokenAmount((numValue / currentPrice).toFixed(2));
    }
  };

  const handleTrade = async () => {
    if (!publicKey) return;

    const amount = parseFloat(tokenAmount);
    if (isNaN(amount) || amount < TOKEN_CONSTANTS.MINIMUM_TRADE_AMOUNT) {
      alert(
        `Minimum trade amount is ${TOKEN_CONSTANTS.MINIMUM_TRADE_AMOUNT} tokens`
      );
      return;
    }
  };

  useEffect(() => {
    const handleError = (error: unknown) => {
      if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        "message" in error &&
        (error as { name: string }).name === "WalletConnectionError" &&
        (error as { message: string }).message.includes("User rejected")
      ) {
        alert("You cancelled the wallet connection.");
      }
    };

    const adapter = wallet?.adapter;
    if (adapter) {
      adapter.on("error", handleError);
      return () => {
        adapter.off("error", handleError);
      };
    }
  }, [wallet]);

  // Set loading to false after a short delay to ensure chart is loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChartLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="flex-1 py-6 px-2 sm:px-4 lg:px-8">
        <div className="w-full">
          <div className="relative h-[600px] w-full rounded-lg bg-black shadow-2xl border border-neutral-800">
            {isChartLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-fuchsia-500"></div>
              </div>
            )}
            <TradingViewWidget
              symbol={"COINBASE:SOLUSD"}
              theme={"dark"}
              interval={"30"}
              height="100%"
              width="100%"
            />
          </div>

          {/* Trade Form Section */}
          <div className="mt-6 bg-black/90 rounded-2xl shadow-2xl p-6 sm:p-10 border border-neutral-800">
            <div className="bg-black/95 rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-600 via-violet-700 to-fuchsia-600 p-2 rounded-full shadow-lg">
                    <Image
                      src="/images/longlifecoin.svg"
                      alt={`${TOKEN_CONSTANTS.NAME} Logo`}
                      width={44}
                      height={44}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-blue-400 bg-clip-text text-transparent mb-1">
                      Trade {TOKEN_CONSTANTS.SYMBOL}
                    </h2>
                    <p className="text-sm text-neutral-300 font-medium">
                      Help health of people
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col justify-start items-start bg-neutral-900 p-4 rounded-2xl border border-neutral-800 shadow-lg min-h-[90px]">
                    <span className="text-xs text-neutral-400 mb-1">
                      Current Price
                    </span>
                    <span className="text-xl text-white">${currentPrice}</span>
                  </div>
                  <div className="flex flex-col justify-start items-start bg-neutral-900 p-4 rounded-2xl border border-neutral-800 shadow-lg min-h-[90px]">
                    <span className="text-xs text-neutral-400 mb-1">
                      Total Supply
                    </span>
                    <span className="text-xl text-white">
                      {TOKEN_CONSTANTS.TOTAL_SUPPLY.toLocaleString()}{" "}
                      {TOKEN_CONSTANTS.SYMBOL}
                    </span>
                  </div>
                  <div className="flex flex-col justify-start items-start bg-neutral-900 p-4 rounded-2xl border border-neutral-800 shadow-lg min-h-[90px]">
                    <span className="text-xs text-neutral-400 mb-1">
                      Pool Liquidity
                    </span>
                    <span className="text-xl text-white">
                      ${TOKEN_CONSTANTS.POOL_LIQUIDITY_USD.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Buy/Sell Toggle */}
                <div className="relative flex w-full max-w-xs mx-auto bg-neutral-900 rounded-full p-1 mb-2 border border-neutral-800">
                  <span
                    className={`absolute top-1 left-1 h-[calc(100%-0.5rem)] w-1/2 rounded-full transition-all duration-300 z-0
                      ${
                        action === "buy"
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                          : "translate-x-full bg-gradient-to-r from-fuchsia-500 to-blue-500"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setAction("buy")}
                    className={`flex-1 z-10 relative py-2 rounded-full text-base font-bold transition-all duration-200
                      ${
                        action === "buy"
                          ? "text-white"
                          : "text-emerald-400 hover:text-white"
                      }`}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    onClick={() => setAction("sell")}
                    className={`flex-1 z-10 relative py-2 rounded-full text-base font-bold transition-all duration-200
                      ${
                        action === "sell"
                          ? "text-white"
                          : "text-fuchsia-400 hover:text-white"
                      }`}
                  >
                    Sell
                  </button>
                </div>

                {/* Amount Inputs */}
                <div className="space-y-5">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">
                      Amount ({TOKEN_CONSTANTS.SYMBOL})
                    </label>
                    <div className="relative group">
                      <input
                        ref={inputRef}
                        type="number"
                        value={tokenAmount}
                        onChange={(e) => updateAmounts(e.target.value, "token")}
                        placeholder="0.00"
                        className="w-full p-3 text-base border border-neutral-800 rounded-lg bg-neutral-900 text-white placeholder-neutral-500 focus:border-fuchsia-500 focus:ring-0 focus:outline-none transition-all duration-200 hide-number-spin"
                      />
                      <p className="text-xs text-neutral-400 mt-1">
                        ${usdAmount} USD
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">
                      Amount (USD)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={usdAmount}
                        onChange={(e) => updateAmounts(e.target.value, "usd")}
                        placeholder="0.00"
                        className="w-full p-3 text-base border border-neutral-800 rounded-lg bg-neutral-900 text-white placeholder-neutral-500 focus:border-blue-500 focus:ring-0 focus:outline-none transition-all duration-200"
                      />
                      <p className="text-xs text-neutral-400 mt-1">
                        {tokenAmount} {TOKEN_CONSTANTS.SYMBOL}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleTrade}
                    disabled={!publicKey || !tokenAmount}
                    className={`w-full py-3 rounded-lg text-base font-bold transition-all duration-200 mt-2 shadow-lg ${
                      action === "buy"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                        : "bg-gradient-to-r from-fuchsia-500 to-blue-500 hover:from-fuchsia-600 hover:to-blue-600"
                    } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {action === "buy" ? "Buy" : "Sell"} {TOKEN_CONSTANTS.SYMBOL}
                  </button>

                  {!publicKey && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-yellow-700/80 to-yellow-900/80 border border-yellow-800 rounded-lg">
                      <p className="text-xs text-yellow-200 text-center font-semibold">
                        <span className="font-bold">Wallet not connected</span>{" "}
                        – Please connect your wallet to start trading
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
