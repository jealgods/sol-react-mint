"use client";

import { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { TOKEN_CONSTANTS } from "@/constants/token";
import TradingViewWidget from "@/components/TradingViewWidget";
import PrivacyPolicyWrapper from "@/components/PrivacyPolicyWrapper";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import {
  FiPlusCircle,
  FiRepeat,
  FiArrowUpCircle,
  FiArrowDownCircle,
  FiMessageCircle,
  FiShare2,
} from "react-icons/fi";
import { GiBridge } from "react-icons/gi";
import { MdOutlineAtm } from "react-icons/md";
import { useRouter } from "next/navigation";
import { FaTwitter, FaTelegramPlane, FaLink } from "react-icons/fa";

function WalletAddressModal({
  open,
  onClose,
  address,
}: {
  open: boolean;
  onClose: () => void;
  address: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative border border-neutral-700">
        <button
          className="absolute top-4 right-4 text-neutral-400 hover:text-fuchsia-400"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="text-lg font-bold text-white mb-4">
          Your Wallet Address
        </h3>
        <div className="flex flex-col items-center gap-2">
          <span className="break-all text-center text-fuchsia-400 font-mono text-sm bg-neutral-800 rounded-lg px-4 py-2 select-all">
            {address}
          </span>
          <button
            className="mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white font-bold hover:from-fuchsia-600 hover:to-blue-600 transition"
            onClick={() => {
              navigator.clipboard.writeText(address);
            }}
          >
            Copy Address
          </button>
        </div>
      </div>
    </div>
  );
}

function ShareModal({
  open,
  onClose,
  url,
}: {
  open: boolean;
  onClose: () => void;
  url: string;
}) {
  if (!open) return null;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    url
  )}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative border border-neutral-700">
        <button
          className="absolute top-4 right-4 text-neutral-400 hover:text-fuchsia-400"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="text-lg font-bold text-white mb-4">Share this page</h3>
        <div className="flex flex-col items-center gap-2">
          <span className="break-all text-center text-fuchsia-400 font-mono text-sm bg-neutral-800 rounded-lg px-4 py-2 select-all">
            {url}
          </span>
          <button
            className="mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white font-bold hover:from-fuchsia-600 hover:to-blue-600 transition flex items-center gap-2"
            onClick={() => {
              navigator.clipboard.writeText(url);
            }}
          >
            <FaLink /> Copy Link
          </button>
          <div className="flex gap-4 mt-4">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-500 text-2xl"
              title="Share on Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-blue-400 text-2xl"
              title="Share on Telegram"
            >
              <FaTelegramPlane />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function TradeContent() {
  const { publicKey, wallet } = useWallet();
  const router = useRouter();
  const [tokenAmount, setTokenAmount] = useState("");
  const [usdAmount, setUsdAmount] = useState("");
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [currentPrice] = useState(1.5);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [pendingTradeAction, setPendingTradeAction] = useState<
    "buy" | "sell" | null
  >(null);

  // Check session storage for privacy policy acceptance
  const checkPrivacyAccepted = () => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("privacyPolicyAccepted") === "true";
    }
    return false;
  };

  const handlePrivacyAccept = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("privacyPolicyAccepted", "true");
    }
    setShowPrivacyModal(false);

    // Execute pending trade action if any
    if (pendingTradeAction) {
      executeTrade(pendingTradeAction);
      setPendingTradeAction(null);
    }
  };

  const executeTrade = async (tradeAction: "buy" | "sell") => {
    if (!publicKey) return;

    const amount = parseFloat(tokenAmount);
    if (isNaN(amount) || amount < TOKEN_CONSTANTS.MINIMUM_TRADE_AMOUNT) {
      alert(
        `Minimum trade amount is ${TOKEN_CONSTANTS.MINIMUM_TRADE_AMOUNT} tokens`
      );
      return;
    }

    // Here you would implement the actual trade logic
    console.log(`Executing ${tradeAction} for ${amount} tokens`);
    alert(
      `${tradeAction.toUpperCase()} order placed for ${amount} ${
        TOKEN_CONSTANTS.SYMBOL
      }`
    );
  };

  const handleTrade = async () => {
    if (!publicKey) return;

    // Check if privacy policy is accepted
    if (!checkPrivacyAccepted()) {
      setPendingTradeAction(action);
      setShowPrivacyModal(true);
      return;
    }

    // If privacy policy is accepted, proceed with trade
    executeTrade(action);
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <main className="flex-1 py-6 px-2 sm:px-4 lg:px-8">
        <div className="w-full">
          {/* Action Buttons Grid */}

          <div className="relative h-[400px] md:h-[600px] w-full rounded-lg bg-black shadow-2xl border border-neutral-800">
            <TradingViewWidget
              symbol={"COINBASE:SOLUSD"}
              theme={"dark"}
              interval={"30"}
              height="100%"
              width="100%"
            />
          </div>
          <div className="w-full max-w-2xl mx-auto my-10">
            <div className="grid grid-cols-4 gap-y-8 gap-x-4 sm:gap-x-8">
              {/* Buy */}
              <div className="flex flex-col items-center">
                <button
                  className="w-16 h-16 flex items-center justify-center rounded-full bg-neutral-800 border-2 border-neutral-700 text-white mb-2 shadow-lg hover:bg-neutral-700 transition-all"
                  onClick={() => {
                    setAction("buy");
                    document
                      .getElementById("trade-toggle")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <FiPlusCircle size={32} />
                </button>
                <span className="text-sm text-neutral-200 font-medium mt-1">
                  Buy
                </span>
              </div>
              {/* Swap */}
              <div className="flex flex-col items-center">
                <button
                  className="w-16 h-16 flex items-center justify-center rounded-full bg-neutral-800 border-2 border-neutral-700 text-white mb-2 shadow-lg hover:bg-neutral-700 transition-all"
                  onClick={() => router.push("/swap")}
                >
                  <FiRepeat size={32} />
                </button>
                <span className="text-sm text-neutral-200 font-medium mt-1">
                  Swap
                </span>
              </div>
              {/* Bridge */}
              <div className="flex flex-col items-center">
                <button
                  className="w-16 h-16 flex items-center justify-center rounded-full bg-neutral-800 border-2 border-neutral-700 text-white mb-2 shadow-lg hover:bg-neutral-700 transition-all"
                  onClick={() => router.push("/bridge")}
                >
                  <GiBridge size={32} />
                </button>
                <span className="text-sm text-neutral-200 font-medium mt-1">
                  Bridge
                </span>
              </div>
              {/* Cash out */}
              <div className="flex flex-col items-center">
                <button className="w-16 h-16 flex items-center justify-center rounded-full bg-neutral-800 border-2 border-neutral-700 text-white mb-2 shadow-lg hover:bg-neutral-700 transition-all">
                  <MdOutlineAtm size={32} />
                </button>
                <span className="text-sm text-neutral-200 font-medium mt-1">
                  Cash out
                </span>
              </div>
              {/* Send */}
              <div className="flex flex-col items-center">
                <button
                  className="w-16 h-16 flex items-center justify-center rounded-full bg-neutral-800 border-2 border-neutral-700 text-white mb-2 shadow-lg hover:bg-neutral-700 transition-all"
                  onClick={() => {
                    setAction("sell");
                    document
                      .getElementById("trade-toggle")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <FiArrowUpCircle size={32} />
                </button>
                <span className="text-sm text-neutral-200 font-medium mt-1">
                  Send
                </span>
              </div>
              {/* Receive */}
              <div className="flex flex-col items-center">
                <button
                  className="w-16 h-16 flex items-center justify-center rounded-full bg-neutral-800 border-2 border-neutral-700 text-white mb-2 shadow-lg hover:bg-neutral-700 transition-all"
                  onClick={() => publicKey && setShowWalletModal(true)}
                  disabled={!publicKey}
                >
                  <FiArrowDownCircle size={32} />
                </button>
                <span className="text-sm text-neutral-200 font-medium mt-1">
                  Receive
                </span>
              </div>
              {/* Text send */}
              <div className="flex flex-col items-center">
                <button className="w-16 h-16 flex items-center justify-center rounded-full bg-neutral-800 border-2 border-neutral-700 text-white mb-2 shadow-lg hover:bg-neutral-700 transition-all">
                  <FiMessageCircle size={32} />
                </button>
                <span className="text-sm text-neutral-200 font-medium mt-1">
                  Text send
                </span>
              </div>
              {/* Share */}
              <div className="flex flex-col items-center">
                <button
                  className="w-16 h-16 flex items-center justify-center rounded-full bg-neutral-800 border-2 border-neutral-700 text-white mb-2 shadow-lg hover:bg-neutral-700 transition-all"
                  onClick={() => setShowShareModal(true)}
                >
                  <FiShare2 size={32} />
                </button>
                <span className="text-sm text-neutral-200 font-medium mt-1">
                  Share
                </span>
              </div>
            </div>
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
                <div
                  id="trade-toggle"
                  className="relative flex w-full max-w-xs mx-auto bg-neutral-900 rounded-full p-1 mb-2 border border-neutral-800"
                >
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
      {/* Wallet Address Modal */}
      <WalletAddressModal
        open={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        address={publicKey?.toBase58?.() || ""}
      />
      {/* Share Modal */}
      <ShareModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        url={typeof window !== "undefined" ? window.location.href : ""}
      />
      {/* Privacy Policy Modal for Trading */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-neutral-900/95 rounded-2xl shadow-2xl border border-neutral-700 p-6">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  Privacy Policy Required
                </h1>
                <p className="text-neutral-300 text-base">
                  Please review and accept our Privacy Policy to continue with
                  your {pendingTradeAction} transaction
                </p>
              </div>
              <PrivacyPolicy onAccept={handlePrivacyAccept} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TradePage() {
  return (
    <PrivacyPolicyWrapper
      title="Welcome to LongLifeCoin Trading"
      subtitle="Please review and accept our Privacy Policy to continue trading"
    >
      <TradeContent />
    </PrivacyPolicyWrapper>
  );
}
