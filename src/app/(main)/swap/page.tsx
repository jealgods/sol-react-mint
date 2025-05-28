"use client";

import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import Image from "next/image";

export default function SwapPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-black/90 rounded-3xl shadow-2xl border border-neutral-800 p-8 relative">
            <h2 className="text-2xl font-extrabold text-center mb-8 bg-gradient-to-r from-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
              Swap Tokens
            </h2>
            {/* Token Selectors */}
            <div className="flex flex-col gap-4">
              {/* From Token */}
              <div className="flex items-center gap-3 bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                <Image
                  src="/images/longlifecoin.svg"
                  alt="From Token"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-lg font-semibold text-white">LLC</span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="ml-auto w-32 bg-transparent text-right text-2xl font-bold text-white outline-none border-none placeholder-neutral-500"
                />
              </div>
              {/* To Token */}
              <div className="flex items-center gap-3 bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                <Image
                  src="/images/solana.svg"
                  alt="To Token"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-lg font-semibold text-white">SOL</span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="ml-auto w-32 bg-transparent text-right text-2xl font-bold text-white outline-none border-none placeholder-neutral-500"
                  disabled
                />
              </div>
              {/* Swap Button */}
              <button className="w-full py-3 mt-4 rounded-xl text-lg font-bold bg-gradient-to-r from-blue-700 via-fuchsia-700 to-black hover:from-blue-800 hover:via-fuchsia-800 hover:to-black text-white border border-fuchsia-800 shadow-lg transition-all duration-200">
                Swap
              </button>
            </div>
            {/* Placeholder for Jupiter v6 integration */}
            <div className="mt-6 text-center text-xs text-neutral-500">
              Powered by Jupiter v6 (coming soon)
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
