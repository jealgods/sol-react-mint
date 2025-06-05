"use client";

import { useState } from "react";
import { FiChevronDown, FiArrowRight, FiSearch } from "react-icons/fi";
import { FaEthereum } from "react-icons/fa";
import { SiSolana } from "react-icons/si";
import { MdClose } from "react-icons/md";
import Image from "next/image";

const CHAINS = [
  {
    symbol: "ETH",
    name: "Ethereum",
    icon: <FaEthereum className="text-indigo-400" size={24} />,
  },
  {
    symbol: "SOL",
    name: "Solana",
    icon: <SiSolana className="text-green-400" size={24} />,
  },
];

const TOKENS = [
  {
    symbol: "LLC",
    name: "LongLifeCoin",
    icon: (
      <Image src="/images/longlifecoin.svg" alt="LLC" width={24} height={24} />
    ),
  },
];

type Chain = {
  symbol: string;
  name: string;
  icon: React.ReactElement;
};

type Token = {
  symbol: string;
  name: string;
  icon: React.ReactElement;
};

interface SelectModalProps<T> {
  open: boolean;
  onClose: () => void;
  onSelect: (item: T) => void;
  items: T[];
  label: string;
}

function SelectModal<
  T extends { symbol: string; name: string; icon: React.ReactElement }
>({ open, onClose, onSelect, items, label }: SelectModalProps<T>) {
  const [search, setSearch] = useState("");
  const filtered = items.filter(
    (item) =>
      item.symbol.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase())
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
        <h3 className="text-lg font-bold text-white mb-4">Select {label}</h3>
        <div className="flex items-center bg-neutral-800 rounded-lg px-3 py-2 mb-4">
          <FiSearch className="text-neutral-400 mr-2" />
          <input
            className="bg-transparent outline-none text-white flex-1"
            placeholder={`Search ${label}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {filtered.map((item) => (
            <button
              key={item.symbol}
              className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-neutral-800 transition"
              onClick={() => {
                onSelect(item);
                onClose();
              }}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="text-white font-semibold mr-2">
                {item.symbol}
              </span>
              <span className="text-neutral-400 text-sm">{item.name}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-neutral-500 text-center py-6">
              No {label} found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BridgePage() {
  const [fromChain, setFromChain] = useState(CHAINS[0]);
  const [toChain, setToChain] = useState(CHAINS[1]);
  const [token, setToken] = useState(TOKENS[0]);
  const [amount, setAmount] = useState("");
  const [showFromChainModal, setShowFromChainModal] = useState(false);
  const [showToChainModal, setShowToChainModal] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);

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
          Bridge Your Assets Securely with LongLifeCoin
        </h2>
        <div className="w-full max-w-md mx-auto">
          <div className="bg-black/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-fuchsia-700/40 p-8 relative ring-2 ring-fuchsia-700/10">
            {/* Bridge Card */}
            <div className="flex flex-col gap-5">
              {/* From Chain */}
              <div className="flex items-center gap-3 bg-neutral-900 rounded-xl p-4 border border-neutral-800 shadow-lg">
                <button
                  className="flex items-center gap-2 px-3 py-1 rounded-lg bg-neutral-800 hover:bg-fuchsia-800 border border-neutral-700 shadow transition"
                  onClick={() => setShowFromChainModal(true)}
                >
                  {fromChain.icon}
                  <span className="font-semibold text-white">
                    {fromChain.symbol}
                  </span>
                  <FiChevronDown className="text-neutral-400" />
                </button>
                <FiArrowRight className="mx-2 text-fuchsia-500" size={20} />
                <button
                  className="flex items-center gap-2 px-3 py-1 rounded-lg bg-neutral-800 hover:bg-fuchsia-800 border border-neutral-700 shadow transition"
                  onClick={() => setShowToChainModal(true)}
                >
                  {toChain.icon}
                  <span className="font-semibold text-white">
                    {toChain.symbol}
                  </span>
                  <FiChevronDown className="text-neutral-400" />
                </button>
              </div>
              {/* Token Select and Amount */}
              <div className="flex items-center gap-3 bg-neutral-900 rounded-xl p-4 border border-neutral-800 shadow-lg">
                <button
                  className="flex items-center gap-2 px-3 py-1 rounded-lg bg-neutral-800 hover:bg-fuchsia-800 border border-neutral-700 shadow transition"
                  onClick={() => setShowTokenModal(true)}
                >
                  {token.icon}
                  <span className="font-semibold text-white">
                    {token.symbol}
                  </span>
                  <FiChevronDown className="text-neutral-400" />
                </button>
                <input
                  type="number"
                  placeholder="0.00"
                  className="ml-auto w-32 bg-transparent text-right text-2xl font-bold text-white outline-none border-none placeholder-neutral-500 hide-number-spin"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              {/* Bridge Button */}
              <button className="w-full py-4 mt-4 rounded-xl text-lg font-extrabold bg-gradient-to-r from-fuchsia-500 to-blue-500 hover:from-fuchsia-600 hover:to-blue-600 text-white shadow-2xl transition-all duration-200 ring-2 ring-fuchsia-700/30 animate-pulse">
                Bridge Now
              </button>
            </div>
          </div>
        </div>
        {/* Select Modals */}
        <SelectModal<Chain>
          open={showFromChainModal}
          onClose={() => setShowFromChainModal(false)}
          onSelect={setFromChain}
          items={CHAINS.filter((c) => c.symbol !== toChain.symbol)}
          label="Source Chain"
        />
        <SelectModal<Chain>
          open={showToChainModal}
          onClose={() => setShowToChainModal(false)}
          onSelect={setToChain}
          items={CHAINS.filter((c) => c.symbol !== fromChain.symbol)}
          label="Destination Chain"
        />
        <SelectModal<Token>
          open={showTokenModal}
          onClose={() => setShowTokenModal(false)}
          onSelect={setToken}
          items={TOKENS}
          label="Token"
        />
      </main>
    </div>
  );
}
