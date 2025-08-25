"use client";

import { useState, useEffect, useRef } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { TOKEN_CONSTANTS } from "@/constants/token";
import TradingViewWidget from "@/components/TradingViewWidget";
import PrivacyPolicyWrapper from "@/components/PrivacyPolicyWrapper";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import { usePoolInfo } from "@/hooks/usePoolInfo";
import {
  sendSolToAdmin,
  sendLLCToAdmin,
  checkSolBalance,
  checkLLCBalance,
  TransactionResult,
} from "@/utils/solanaTransactions";
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

function TextSendModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || !recipient.trim()) {
      alert("Please fill in both message and recipient fields");
      return;
    }

    setIsSending(true);
    try {
      // Here you would typically send the message to your backend
      // For now, we'll simulate a successful send
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Message sent successfully!");
      setMessage("");
      setRecipient("");
      onClose();
    } catch {
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-neutral-700">
        <button
          className="absolute top-4 right-4 text-neutral-400 hover:text-yellow-400"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FiMessageCircle className="text-yellow-400" />
          Send Message
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter wallet address or username"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-yellow-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              rows={4}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg bg-neutral-700 text-white font-medium hover:bg-neutral-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSending || !message.trim() || !recipient.trim()}
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-medium hover:from-yellow-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isSending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TradeContent() {
  const { publicKey, wallet, signTransaction } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const { poolInfo, loading: poolLoading } = usePoolInfo();
  const [tokenAmount, setTokenAmount] = useState("");
  const [usdAmount, setUsdAmount] = useState("");
  const [solAmount, setSolAmount] = useState("");
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [currencyType, setCurrencyType] = useState<"usd" | "sol">("usd");
  const inputRef = useRef<HTMLInputElement>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTextSendModal, setShowTextSendModal] = useState(false);
  const [pendingTradeAction, setPendingTradeAction] = useState<
    "buy" | "sell" | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  // Remove the wallet check that shows loading state
  // The UI should be visible even without a connected wallet

  const executeTrade = async (tradeAction: "buy" | "sell") => {
    if (!publicKey || !signTransaction || !connection) {
      alert("Wallet not connected or connection not available");
      return;
    }

    const amount = parseFloat(tokenAmount);
    if (isNaN(amount) || amount < TOKEN_CONSTANTS.MINIMUM_TRADE_AMOUNT) {
      alert(
        `Minimum trade amount is ${TOKEN_CONSTANTS.MINIMUM_TRADE_AMOUNT} tokens`
      );
      return;
    }

    setIsProcessing(true);

    try {
      let result: TransactionResult;

      if (tradeAction === "buy") {
        // For buy: send SOL to admin wallet
        const solAmountToSend = parseFloat(solAmount);

        // Check if user has enough SOL balance
        const hasEnoughSol = await checkSolBalance(
          connection,
          publicKey,
          solAmountToSend
        );
        if (!hasEnoughSol) {
          alert("Insufficient SOL balance for this transaction");
          return;
        }

        result = await sendSolToAdmin(
          connection,
          publicKey,
          solAmountToSend,
          signTransaction
        );
      } else {
        // For sell: send LLC tokens to admin wallet
        const llcAmountToSend = parseFloat(tokenAmount);

        // Check if user has enough LLC balance
        const hasEnoughLLC = await checkLLCBalance(
          connection,
          publicKey,
          llcAmountToSend
        );
        if (!hasEnoughLLC) {
          alert("Insufficient LLC token balance for this transaction");
          return;
        }

        result = await sendLLCToAdmin(
          connection,
          publicKey,
          llcAmountToSend,
          signTransaction
        );
      }

      if (result.success) {
        alert(
          `${tradeAction.toUpperCase()} transaction successful!\nTransaction signature: ${
            result.signature
          }`
        );
        // Clear form after successful transaction
        setTokenAmount("");
        setUsdAmount("");
        setSolAmount("");
      } else {
        alert(`Transaction failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Trade execution error:", error);
      alert(
        `Transaction failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsProcessing(false);
    }
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

  const updateAmounts = (value: string, type: "token" | "currency") => {
    const numValue = parseFloat(value) || 0;

    // Use real prices from pool info
    const llcPriceSOL = poolInfo?.llcPriceSOL || 0;
    const llcPriceUSD = poolInfo?.llcPriceUSD || 0;

    if (type === "token") {
      setTokenAmount(value);
      // Calculate both USD and SOL amounts using real LLC prices
      setUsdAmount((numValue * llcPriceUSD).toFixed(6));
      setSolAmount((numValue * llcPriceSOL).toFixed(9));
    } else {
      // Handle currency input (USD or SOL)
      if (currencyType === "usd") {
        setUsdAmount(value);
        // Calculate token amount using real LLC price
        setTokenAmount(
          llcPriceUSD > 0 ? (numValue / llcPriceUSD).toFixed(2) : "0"
        );
        // Calculate SOL amount
        setSolAmount(
          llcPriceUSD > 0
            ? ((numValue / llcPriceUSD) * llcPriceSOL).toFixed(9)
            : "0"
        );
      } else {
        setSolAmount(value);
        // Calculate token amount using real LLC price
        setTokenAmount(
          llcPriceSOL > 0 ? (numValue / llcPriceSOL).toFixed(2) : "0"
        );
        // Calculate USD amount
        setUsdAmount(
          llcPriceSOL > 0
            ? ((numValue / llcPriceSOL) * llcPriceUSD).toFixed(6)
            : "0"
        );
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-neutral-900 to-black">
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          {/* Chart Section */}
          <div className="relative h-[280px] md:h-[380px] w-full max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-neutral-900 to-black shadow-2xl border border-neutral-800 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/10 to-blue-500/10 pointer-events-none"></div>
            <TradingViewWidget
              symbol={"COINBASE:SOLUSD"}
              theme={"dark"}
              interval={"30"}
              height="100%"
              width="100%"
            />
          </div>

          {/* Action Buttons Grid */}
          <div className="w-full max-w-3xl mx-auto">
            <div className="grid grid-cols-4 gap-y-8 gap-x-4 sm:gap-x-8">
              {/* Buy */}
              <div className="flex flex-col items-center group">
                <button
                  className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 border-2 border-emerald-400/30 text-white mb-3 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group-hover:border-emerald-300/50"
                  onClick={() => {
                    setAction("buy");
                    document
                      .getElementById("trade-toggle")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <FiPlusCircle size={28} />
                </button>
                <span className="text-sm text-neutral-200 font-semibold group-hover:text-emerald-300 transition-colors">
                  Buy
                </span>
              </div>
              {/* Swap */}
              <div className="flex flex-col items-center group">
                <button
                  className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 border-2 border-blue-400/30 text-white mb-3 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group-hover:border-blue-300/50"
                  onClick={() => router.push("/swap")}
                >
                  <FiRepeat size={28} />
                </button>
                <span className="text-sm text-neutral-200 font-semibold group-hover:text-blue-300 transition-colors">
                  Swap
                </span>
              </div>
              {/* Bridge */}
              <div className="flex flex-col items-center group">
                <button
                  className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 border-2 border-purple-400/30 text-white mb-3 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group-hover:border-purple-300/50"
                  onClick={() => router.push("/bridge")}
                >
                  <GiBridge size={28} />
                </button>
                <span className="text-sm text-neutral-200 font-semibold group-hover:text-purple-300 transition-colors">
                  Bridge
                </span>
              </div>
              {/* Cash out */}
              <div className="flex flex-col items-center group">
                <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 border-2 border-orange-400/30 text-white mb-3 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group-hover:border-orange-300/50">
                  <MdOutlineAtm size={28} />
                </button>
                <span className="text-sm text-neutral-200 font-semibold group-hover:text-orange-300 transition-colors">
                  Cash out
                </span>
              </div>
              {/* Send */}
              <div className="flex flex-col items-center group">
                <button
                  className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-600 border-2 border-fuchsia-400/30 text-white mb-3 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group-hover:border-fuchsia-300/50"
                  onClick={() => {
                    setAction("sell");
                    document
                      .getElementById("trade-toggle")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <FiArrowUpCircle size={28} />
                </button>
                <span className="text-sm text-neutral-200 font-semibold group-hover:text-fuchsia-300 transition-colors">
                  Sell
                </span>
              </div>
              {/* Receive */}
              <div className="flex flex-col items-center group">
                <button
                  className={`w-16 h-16 flex items-center justify-center rounded-2xl border-2 mb-3 shadow-xl transition-all duration-300 group-hover:scale-105 ${
                    publicKey
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-400/30 text-white hover:shadow-2xl group-hover:border-green-300/50"
                      : "bg-gradient-to-br from-neutral-700 to-neutral-800 border-neutral-600/30 text-neutral-400 cursor-not-allowed"
                  }`}
                  onClick={() => publicKey && setShowWalletModal(true)}
                  disabled={!publicKey}
                >
                  <FiArrowDownCircle size={28} />
                </button>
                <span
                  className={`text-sm font-semibold transition-colors ${
                    publicKey
                      ? "text-neutral-200 group-hover:text-green-300"
                      : "text-neutral-500"
                  }`}
                >
                  Receive
                </span>
              </div>
              {/* Text send */}
              <div className="flex flex-col items-center group">
                <button
                  className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 border-2 border-yellow-400/30 text-white mb-3 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group-hover:border-yellow-300/50"
                  onClick={() => setShowTextSendModal(true)}
                >
                  <FiMessageCircle size={28} />
                </button>
                <span className="text-sm text-neutral-200 font-semibold group-hover:text-yellow-300 transition-colors">
                  Text send
                </span>
              </div>
              {/* Share */}
              <div className="flex flex-col items-center group">
                <button
                  className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-indigo-400/30 text-white mb-3 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group-hover:border-indigo-300/50"
                  onClick={() => setShowShareModal(true)}
                >
                  <FiShare2 size={28} />
                </button>
                <span className="text-sm text-neutral-200 font-semibold group-hover:text-indigo-300 transition-colors">
                  Share
                </span>
              </div>
            </div>
          </div>
          {/* Trade Form Section */}
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-neutral-900/95 to-black/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-neutral-800/50">
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex flex-col justify-start items-start bg-gradient-to-br from-emerald-900/50 to-teal-900/50 p-6 rounded-2xl border border-emerald-800/30 shadow-xl min-h-[100px] backdrop-blur-sm">
                    <span className="text-xs text-emerald-300 mb-2 font-semibold uppercase tracking-wide">
                      Current Price
                    </span>
                    <span className="text-xl text-white font-bold">
                      {poolLoading ? (
                        <div className="animate-pulse bg-neutral-700 h-6 w-24 rounded"></div>
                      ) : (
                        <>
                          {poolInfo?.llcPriceSOL
                            ? `${poolInfo.llcPriceSOL.toFixed(9)} SOL`
                            : "N/A"}
                          <br />
                          <span className="text-sm text-emerald-300 font-medium">
                            $
                            {poolInfo?.llcPriceUSD
                              ? poolInfo.llcPriceUSD.toFixed(6)
                              : "N/A"}
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex flex-col justify-start items-start bg-gradient-to-br from-blue-900/50 to-cyan-900/50 p-6 rounded-2xl border border-blue-800/30 shadow-xl min-h-[100px] backdrop-blur-sm">
                    <span className="text-xs text-blue-300 mb-2 font-semibold uppercase tracking-wide">
                      Total Supply
                    </span>
                    <span className="text-xl text-white font-bold">
                      {poolInfo?.llcBalance?.toLocaleString() || (
                        <div className="animate-pulse bg-neutral-700 h-6 w-20 rounded"></div>
                      )}{" "}
                      {TOKEN_CONSTANTS.SYMBOL}
                    </span>
                  </div>
                  <div className="flex flex-col justify-start items-start bg-gradient-to-br from-purple-900/50 to-fuchsia-900/50 p-6 rounded-2xl border border-purple-800/30 shadow-xl min-h-[100px] backdrop-blur-sm">
                    <span className="text-xs text-purple-300 mb-2 font-semibold uppercase tracking-wide">
                      Pool Liquidity
                    </span>
                    <span className="text-xl text-white font-bold">
                      {poolLoading ? (
                        <div className="animate-pulse bg-neutral-700 h-6 w-20 rounded"></div>
                      ) : (
                        <>
                          {poolInfo?.solBalance
                            ? `${poolInfo.solBalance.toFixed(4)} SOL`
                            : "N/A"}
                          <br />
                          <span className="text-sm text-purple-300 font-medium">
                            $
                            {poolInfo?.solBalance && poolInfo?.solPriceUSD
                              ? (
                                  poolInfo.solBalance * poolInfo.solPriceUSD
                                ).toFixed(2)
                              : "N/A"}
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Buy/Sell Toggle */}
                <div
                  id="trade-toggle"
                  className="relative flex w-full max-w-sm mx-auto bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-1.5 mb-4 border border-neutral-800/50 shadow-xl"
                >
                  <span
                    className={`absolute top-1.5 left-1.5 h-[calc(100%-0.75rem)] w-1/2 rounded-xl transition-all duration-300 z-0 shadow-lg
                      ${
                        action === "buy"
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                          : "translate-x-full bg-gradient-to-r from-fuchsia-500 to-blue-500"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setAction("buy")}
                    className={`flex-1 z-10 relative py-3 px-6 rounded-xl text-base font-bold transition-all duration-200
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
                    className={`flex-1 z-10 relative py-3 px-6 rounded-xl text-base font-bold transition-all duration-200
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
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">
                      Amount ({TOKEN_CONSTANTS.SYMBOL})
                    </label>
                    <div className="relative group">
                      <input
                        ref={inputRef}
                        type="number"
                        value={tokenAmount}
                        onChange={(e) => updateAmounts(e.target.value, "token")}
                        placeholder="0.00"
                        className="w-full p-4 text-lg border border-neutral-700 rounded-2xl bg-neutral-900/80 backdrop-blur-sm text-white placeholder-neutral-500 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 focus:outline-none transition-all duration-300 hide-number-spin shadow-lg"
                      />
                      <div className="flex justify-between text-xs text-neutral-400 mt-2 px-1">
                        <span className="bg-neutral-800/50 px-2 py-1 rounded-lg">
                          ${usdAmount} USD
                        </span>
                        <span className="bg-neutral-800/50 px-2 py-1 rounded-lg">
                          {solAmount} SOL
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Currency Type Toggle */}
                  <div className="flex justify-center">
                    <div className="relative flex bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-1.5 border border-neutral-800/50 shadow-lg">
                      <span
                        className={`absolute top-1.5 left-1.5 h-[calc(100%-0.75rem)] w-1/2 rounded-xl transition-all duration-300 z-0 shadow-lg
                           ${
                             currencyType === "usd"
                               ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                               : "translate-x-full bg-gradient-to-r from-orange-500 to-yellow-500"
                           }`}
                      />
                      <button
                        type="button"
                        onClick={() => setCurrencyType("usd")}
                        className={`flex-1 z-10 relative py-2.5 px-6 rounded-xl text-sm font-bold transition-all duration-200
                           ${
                             currencyType === "usd"
                               ? "text-white"
                               : "text-blue-400 hover:text-white"
                           }`}
                      >
                        USD
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrencyType("sol")}
                        className={`flex-1 z-10 relative py-2.5 px-6 rounded-xl text-sm font-bold transition-all duration-200
                           ${
                             currencyType === "sol"
                               ? "text-white"
                               : "text-orange-400 hover:text-white"
                           }`}
                      >
                        SOL
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">
                      Amount ({currencyType.toUpperCase()})
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={currencyType === "usd" ? usdAmount : solAmount}
                        onChange={(e) =>
                          updateAmounts(e.target.value, "currency")
                        }
                        placeholder="0.00"
                        className="w-full p-4 text-lg border border-neutral-700 rounded-2xl bg-neutral-900/80 backdrop-blur-sm text-white placeholder-neutral-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300 shadow-lg"
                      />
                      <p className="text-xs text-neutral-400 mt-2 px-1">
                        <span className="bg-neutral-800/50 px-2 py-1 rounded-lg">
                          {tokenAmount} {TOKEN_CONSTANTS.SYMBOL}
                        </span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleTrade}
                    disabled={!publicKey || !tokenAmount || isProcessing}
                    className={`w-full py-4 rounded-2xl text-lg font-bold transition-all duration-300 mt-4 shadow-2xl hover:shadow-3xl hover:scale-[1.02] ${
                      !publicKey
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                        : action === "buy"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                        : "bg-gradient-to-r from-fuchsia-500 to-blue-500 hover:from-fuchsia-600 hover:to-blue-600"
                    } text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : !publicKey ? (
                      "Select Wallet to Trade"
                    ) : (
                      `${action === "buy" ? "Buy" : "Sell"} ${
                        TOKEN_CONSTANTS.SYMBOL
                      }`
                    )}
                  </button>

                  {!publicKey && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-purple-700/80 to-purple-900/80 border border-purple-800/50 rounded-2xl backdrop-blur-sm">
                      <p className="text-sm text-purple-200 text-center font-semibold">
                        <span className="font-bold">Connect your wallet</span>{" "}
                        to start trading {TOKEN_CONSTANTS.SYMBOL}
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
      {/* Text Send Modal */}
      <TextSendModal
        open={showTextSendModal}
        onClose={() => setShowTextSendModal(false)}
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
