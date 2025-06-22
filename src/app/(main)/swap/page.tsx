"use client";

import { useState } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import { FaEthereum } from "react-icons/fa";
import { SiTether, SiBitcoincash } from "react-icons/si";
import { MdClose } from "react-icons/md";
import Image from "next/image";
import { HiSwitchHorizontal } from "react-icons/hi";
import PrivacyPolicyWrapper from "@/components/PrivacyPolicyWrapper";

const TOKENS = [
  {
    symbol: "ETH",
    name: "Ethereum",
    icon: <FaEthereum className="text-indigo-400" size={24} />, // or use /images/eth.svg
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    icon: <Image src="/globe.svg" alt="USDC" width={24} height={24} />, // placeholder
  },
  {
    symbol: "USDT",
    name: "Tether",
    icon: <SiTether className="text-green-400" size={24} />,
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    icon: <SiBitcoincash className="text-yellow-400" size={24} />,
  },
  {
    symbol: "LLC",
    name: "LongLifeCoin",
    icon: (
      <Image src="/images/longlifecoin.svg" alt="LLC" width={24} height={24} />
    ),
  },
];

type Token = {
  symbol: string;
  name: string;
  icon: React.ReactElement;
};

interface TokenSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  tokens: Token[];
}

function TokenSelectModal({
  open,
  onClose,
  onSelect,
  tokens,
}: TokenSelectModalProps) {
  const [search, setSearch] = useState("");
  const filtered = tokens.filter(
    (t: Token) =>
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase())
  );
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-neutral-700">
        <button
          className="absolute top-4 right-4 text-neutral-400 hover:text-fuchsia-400"
          onClick={onClose}
        >
          <MdClose size={24} />
        </button>
        <h3 className="text-lg font-bold text-white mb-4">Select a token</h3>
        <div className="flex items-center bg-neutral-800 rounded-lg px-3 py-2 mb-4">
          <FiSearch className="text-neutral-400 mr-2" />
          <input
            className="bg-transparent outline-none text-white flex-1"
            placeholder="Search tokens"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {filtered.map((token: Token) => (
            <button
              key={token.symbol}
              className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-neutral-800 transition"
              onClick={() => {
                onSelect(token);
                onClose();
              }}
            >
              <span className="mr-3">{token.icon}</span>
              <span className="text-white font-semibold mr-2">
                {token.symbol}
              </span>
              <span className="text-neutral-400 text-sm">{token.name}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-neutral-500 text-center py-6">
              No tokens found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SwapContent() {
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[2]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);

  const handleSwitch = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-black via-neutral-900 to-black overflow-x-hidden">
      {/* Animated background gradient glow (no overflow) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] max-w-full max-h-full bg-gradient-to-br from-fuchsia-700/30 via-blue-700/20 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ minWidth: 0, minHeight: 0 }}
        />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center px-2 py-10 z-10 relative">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-br from-blue-600 via-violet-700 to-fuchsia-600 p-2 rounded-full shadow-xl mb-2">
            <Image
              src="/images/longlifecoin.svg"
              alt="LongLifeCoin Logo"
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
        </div>
        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-fuchsia-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
          Instantly Swap Crypto with LongLifeCoin
        </h2>
        <div className="w-full max-w-md mx-auto">
          <div className="bg-black/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-fuchsia-700/40 p-8 relative ring-2 ring-fuchsia-700/10">
            {/* Swap Card */}
            <div className="flex flex-col gap-5">
              {/* From Token */}
              <div className="flex items-center gap-3 bg-neutral-900 rounded-xl p-4 border border-neutral-800 shadow-lg">
                <button
                  className="flex items-center gap-2 px-3 py-1 rounded-lg bg-neutral-800 hover:bg-fuchsia-800 border border-neutral-700 shadow transition"
                  onClick={() => setShowFromModal(true)}
                >
                  {fromToken.icon}
                  <span className="font-semibold text-white">
                    {fromToken.symbol}
                  </span>
                  <FiChevronDown className="text-neutral-400" />
                </button>
                <input
                  type="number"
                  placeholder="0.00"
                  className="ml-auto w-32 bg-transparent text-right text-2xl font-bold text-white outline-none border-none placeholder-neutral-500 hide-number-spin"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                />
              </div>
              {/* Small inline swap button */}
              <div className="flex justify-center my-1">
                <button
                  className="flex items-center justify-center rounded-full bg-neutral-800 border border-fuchsia-700 text-fuchsia-400 hover:bg-fuchsia-800 hover:text-white transition p-1 w-8 h-8 shadow"
                  onClick={handleSwitch}
                  aria-label="Switch tokens"
                  style={{ fontSize: 20 }}
                >
                  <HiSwitchHorizontal />
                </button>
              </div>
              {/* To Token */}
              <div className="flex items-center gap-3 bg-neutral-900 rounded-xl p-4 border border-neutral-800 shadow-lg">
                <button
                  className="flex items-center gap-2 px-3 py-1 rounded-lg bg-neutral-800 hover:bg-fuchsia-800 border border-neutral-700 shadow transition"
                  onClick={() => setShowToModal(true)}
                >
                  {toToken.icon}
                  <span className="font-semibold text-white">
                    {toToken.symbol}
                  </span>
                  <FiChevronDown className="text-neutral-400" />
                </button>
                <input
                  type="number"
                  placeholder="0.00"
                  className="ml-auto w-32 bg-transparent text-right text-2xl font-bold text-white outline-none border-none placeholder-neutral-500 hide-number-spin"
                  value={toAmount}
                  onChange={(e) => setToAmount(e.target.value)}
                />
              </div>
              {/* Swap Button */}
              <button className="w-full py-4 mt-4 rounded-xl text-lg font-extrabold bg-gradient-to-r from-fuchsia-500 to-blue-500 hover:from-fuchsia-600 hover:to-blue-600 text-white shadow-2xl transition-all duration-200 ring-2 ring-fuchsia-700/30 animate-pulse">
                Swap Now
              </button>
            </div>
          </div>
        </div>
        {/* Token Select Modals */}
        <TokenSelectModal
          open={showFromModal}
          onClose={() => setShowFromModal(false)}
          onSelect={setFromToken}
          tokens={TOKENS}
        />
        <TokenSelectModal
          open={showToModal}
          onClose={() => setShowToModal(false)}
          onSelect={setToToken}
          tokens={TOKENS}
        />
      </main>
    </div>
  );
}

export default function SwapPage() {
  return (
    <PrivacyPolicyWrapper
      title="Welcome to LongLifeCoin Swap"
      subtitle="Please review and accept our Privacy Policy to continue swapping"
    >
      <SwapContent />
    </PrivacyPolicyWrapper>
  );
}
