"use client";

import { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { TOKEN_CONSTANTS } from "@/constants/token";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

// Dynamically import the wallet button with no SSR
const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

export default function TradePage() {
  const { publicKey, wallet } = useWallet();
  const [tokenAmount, setTokenAmount] = useState("");
  const [usdAmount, setUsdAmount] = useState("");
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [currentPrice] = useState(1.5);
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
    if (!publicKey) {
      return;
    }

    const amount = parseFloat(tokenAmount);
    if (isNaN(amount) || amount < TOKEN_CONSTANTS.MINIMUM_TRADE_AMOUNT) {
      alert(
        `Minimum trade amount is ${TOKEN_CONSTANTS.MINIMUM_TRADE_AMOUNT} tokens`
      );
      return;
    }

    // Check verification status before proceeding with trade
    // try {
    //   const response = await fetch("/api/verify/status");
    //   const data = await response.json();

    //   if (!data.verified) {
    //     router.push("/verify");
    //     return;
    //   }

    //   // TODO: Implement actual trading logic
    //   console.log(`${action}ing ${amount} tokens`);
    // } catch (error) {
    //   console.error("Error checking verification status:", error);
    //   alert("Unable to process trade. Please try again.");
    // }
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
        // Show a toast or ignore
        alert("You cancelled the wallet connection.");
      }
    };

    wallet?.adapter?.on("error", handleError);

    return () => {
      wallet?.adapter?.off("error", handleError);
    };
  }, [wallet]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      <Header />
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-slate-800/90 to-slate-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-10 border border-purple-900/40">
          <div className="bg-slate-900/95 rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-full shadow-lg">
                  <Image
                    src="/images/longlifecoin.svg"
                    alt={`${TOKEN_CONSTANTS.NAME} Logo`}
                    width={44}
                    height={44}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                    Trade {TOKEN_CONSTANTS.SYMBOL}
                  </h2>
                  <p className="text-sm text-slate-400 font-medium">
                    Help health of people
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-auto flex sm:justify-end items-center">
                <WalletMultiButton className="!w-full sm:!w-auto !bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-pink-600 !rounded-xl !shadow-lg !text-base !font-semibold" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col justify-start items-start bg-gradient-to-br from-[#6a4cff] via-[#a259ff] to-[#ff6ac1] p-4 rounded-2xl border border-purple-400/40 shadow-lg min-h-[90px]">
                  <span className="text-xs  text-white/80 mb-1">
                    Current Price
                  </span>
                  <span className="text-xl text-white">${currentPrice}</span>
                </div>
                <div className="flex flex-col justify-start items-start bg-gradient-to-br from-[#6a4cff] via-[#a259ff] to-[#ff6ac1] p-4 rounded-2xl border border-purple-400/40 shadow-lg min-h-[90px]">
                  <span className="text-xs  text-white/80 mb-1">
                    Total Supply
                  </span>
                  <span className="text-xl  text-white">
                    {TOKEN_CONSTANTS.TOTAL_SUPPLY.toLocaleString()}{" "}
                    {TOKEN_CONSTANTS.SYMBOL}
                  </span>
                </div>
                <div className="flex flex-col justify-start items-start bg-gradient-to-br from-[#6a4cff] via-[#a259ff] to-[#ff6ac1] p-4 rounded-2xl border border-purple-400/40 shadow-lg min-h-[90px]">
                  <span className="text-xs  text-white/80 mb-1">
                    Pool Liquidity
                  </span>
                  <span className="text-xl text-white">
                    ${TOKEN_CONSTANTS.POOL_LIQUIDITY_USD.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Buy/Sell Toggle */}
              <div className="relative flex w-full max-w-xs mx-auto bg-slate-800/80 rounded-full p-1 mb-2 border border-purple-900/30">
                {/* Sliding highlight */}
                <span
                  className={`absolute top-1 left-1 h-[calc(100%-0.5rem)] w-1/2 rounded-full transition-all duration-300 z-0
                    ${
                      action === "buy"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                        : "translate-x-full bg-gradient-to-r from-rose-500 to-pink-500"
                    }
                  `}
                />
                <button
                  type="button"
                  onClick={() => setAction("buy")}
                  className={`flex-1 z-10 relative py-2 rounded-full text-base font-bold transition-all duration-200
                    ${
                      action === "buy"
                        ? "text-white"
                        : "text-emerald-400 hover:text-white"
                    }
                  `}
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
                        : "text-rose-400 hover:text-white"
                    }
                  `}
                >
                  Sell
                </button>
              </div>

              {/* Amount Inputs */}
              <div className="space-y-5">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Amount ({TOKEN_CONSTANTS.SYMBOL})
                  </label>
                  <div className="relative group">
                    <input
                      ref={inputRef}
                      type="number"
                      value={tokenAmount}
                      onChange={(e) => updateAmounts(e.target.value, "token")}
                      placeholder="0.00"
                      className="w-full p-3 text-base border border-slate-700 rounded-lg bg-slate-800/90 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-0 focus:outline-none transition-all duration-200 hide-number-spin"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      ≈ ${usdAmount} USD
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Amount (USD)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={usdAmount}
                      onChange={(e) => updateAmounts(e.target.value, "usd")}
                      placeholder="0.00"
                      className="w-full p-3 text-base border border-slate-700 rounded-lg bg-slate-800/90 text-white placeholder-slate-500 focus:border-pink-500 focus:ring-0 focus:outline-none transition-all duration-200"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      ≈ {tokenAmount} {TOKEN_CONSTANTS.SYMBOL}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleTrade}
                  disabled={!publicKey || !tokenAmount}
                  className={`w-full py-3 rounded-lg text-base font-bold transition-all duration-200 mt-2 shadow-lg ${
                    action === "buy"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                      : "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                  } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {action === "buy" ? "Buy" : "Sell"} {TOKEN_CONSTANTS.SYMBOL}
                </button>

                {!publicKey && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-amber-700/80 to-amber-900/80 border border-amber-800 rounded-lg">
                    <p className="text-xs text-amber-200 text-center font-semibold">
                      <span className="font-bold">Wallet not connected</span> –
                      Please connect your wallet to start trading
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
