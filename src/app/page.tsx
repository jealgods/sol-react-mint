"use client";

import { TokenBalance } from "../components/TokenBalance";
import { TransactionHistory } from "../components/TransactionHistory";
import Link from "next/link";
import { TOKEN_CONSTANTS } from "../constants/token";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {TOKEN_CONSTANTS.NAME} ({TOKEN_CONSTANTS.SYMBOL}) Exchange
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              Trade {TOKEN_CONSTANTS.SYMBOL} Tokens
            </h2>
            <div className="space-y-4">
              <Link
                href="/trade"
                className="block w-full bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600"
              >
                Trade Tokens
              </Link>
              <TokenBalance tokenMint="your_token_mint_address" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <TransactionHistory />
          </div>
        </div>
      </main>
    </div>
  );
}
