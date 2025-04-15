"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { TOKEN_CONSTANTS } from "@/constants/token";

// Dynamically import the wallet button with no SSR
const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

export default function TradePage() {
  const { publicKey } = useWallet();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tokenAmount, setTokenAmount] = useState("");
  const [usdAmount, setUsdAmount] = useState("");
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [currentPrice] = useState(TOKEN_CONSTANTS.INITIAL_PRICE_USD);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const response = await fetch("/api/verify/status");
        const data = await response.json();
        setIsVerified(data.verified);
        if (!data.verified) {
          router.replace("/verify");
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkVerification();
  }, [router]);

  if (loading) {
    return null;
  }

  if (!isVerified) {
    return null;
  }

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

    // TODO: Implement actual trading logic
    console.log(`${action}ing ${amount} tokens`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-16">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6">
        <div className="bg-white/90 rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg shadow-md">
                <Image
                  src="/images/longlifecoin.svg"
                  alt={`${TOKEN_CONSTANTS.NAME} Logo`}
                  width={36}
                  height={36}
                  className="rounded-md"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Trade {TOKEN_CONSTANTS.SYMBOL}
                </h2>
                <p className="text-xs text-indigo-500">
                  Secure and instant trading
                </p>
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <WalletMultiButton className="!w-full sm:!w-auto !bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 !rounded-lg !shadow-md !text-sm" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-3 rounded-lg border border-indigo-100">
                <p className="text-xs font-medium text-indigo-600">
                  Current Price
                </p>
                <p className="text-lg font-bold text-indigo-800">
                  ${currentPrice.toExponential(2)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100">
                <p className="text-xs font-medium text-purple-600">
                  Total Supply
                </p>
                <p className="text-lg font-bold text-purple-800">
                  {TOKEN_CONSTANTS.TOTAL_SUPPLY.toExponential(2)}{" "}
                  {TOKEN_CONSTANTS.SYMBOL}
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-3 rounded-lg border border-pink-100">
                <p className="text-xs font-medium text-pink-600">
                  Pool Liquidity
                </p>
                <p className="text-lg font-bold text-pink-800">$1,000 USD</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-lg p-4 border border-indigo-100">
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setAction("buy")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    action === "buy"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
                      : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setAction("sell")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    action === "sell"
                      ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md"
                      : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                  }`}
                >
                  Sell
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-indigo-600">
                    Amount ({TOKEN_CONSTANTS.SYMBOL})
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={tokenAmount}
                      onChange={(e) => updateAmounts(e.target.value, "token")}
                      placeholder="0.00"
                      className="w-full p-2 text-sm border border-indigo-200 rounded-lg bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                    <p className="text-xs text-indigo-500 mt-1">
                      ≈ ${usdAmount} USD
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-indigo-600">
                    Amount (USD)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={usdAmount}
                      onChange={(e) => updateAmounts(e.target.value, "usd")}
                      placeholder="0.00"
                      className="w-full p-2 text-sm border border-indigo-200 rounded-lg bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                    <p className="text-xs text-indigo-500 mt-1">
                      ≈ {tokenAmount} {TOKEN_CONSTANTS.SYMBOL}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleTrade}
                  disabled={!publicKey || !tokenAmount || loading}
                  className={`w-full py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    action === "buy"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                      : "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
                  } text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {action === "buy" ? "Buy" : "Sell"} {TOKEN_CONSTANTS.SYMBOL}
                </button>

                {!publicKey && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-700 text-center">
                      <span className="font-medium">Wallet not connected</span>{" "}
                      - Please connect your wallet to start trading
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
