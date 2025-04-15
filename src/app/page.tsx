"use client";

import { TokenBalance } from "../components/TokenBalance";
import { TransactionHistory } from "../components/TransactionHistory";
import Link from "next/link";
import { TOKEN_CONSTANTS } from "../constants/token";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-16">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6">
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
                    {TOKEN_CONSTANTS.NAME} ({TOKEN_CONSTANTS.SYMBOL}) Exchange
                  </h2>
                  <p className="text-xs text-indigo-500">
                    Secure and instant trading
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-lg p-4 border border-indigo-100">
                <h2 className="text-lg font-semibold text-indigo-800 mb-4">
                  Trade {TOKEN_CONSTANTS.SYMBOL} Tokens
                </h2>
                <div className="space-y-4">
                  <Link
                    href="/verify"
                    className="block w-full py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md text-center"
                  >
                    Trade Tokens
                  </Link>
                  <div className="bg-white/80 rounded-lg p-3 border border-indigo-100">
                    <TokenBalance tokenMint={TOKEN_CONSTANTS.MINT_ADDRESS} />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-lg p-4 border border-indigo-100">
                <h2 className="text-lg font-semibold text-indigo-800 mb-4">
                  Transaction History
                </h2>
                <div className="bg-white/80 rounded-lg p-3 border border-indigo-100">
                  <TransactionHistory />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
