"use client";

import { TokenBalance } from "../components/TokenBalance";
import { TransactionHistory } from "../components/TransactionHistory";
import Link from "next/link";
import { TOKEN_CONSTANTS } from "../constants/token";
import { useState } from "react";
import PrivacyPolicy from "../components/PrivacyPolicy";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function Home() {
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Left Column - Trade Section */}
            <div className="w-full">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-3 xs:p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-indigo-800 mb-4">
                  Trade {TOKEN_CONSTANTS.SYMBOL} Tokens
                </h2>
                <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                  <div className="max-w-full mx-auto">
                    <PrivacyPolicy onAccept={() => setPrivacyAccepted(true)} />
                  </div>
                  <Link
                    href={privacyAccepted ? "/trade" : "#"}
                    className={`block w-full py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 text-center ${
                      privacyAccepted
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      if (!privacyAccepted) {
                        e.preventDefault();
                      }
                    }}
                  >
                    Trade Tokens
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Whitepaper and Balance */}
            <div className="w-full space-y-2 xs:space-y-3 sm:space-y-4">
              {/* Whitepaper */}
              <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-lg p-3 xs:p-4 sm:p-6 border border-indigo-100">
                <Link
                  href="/whitepaper.pdf"
                  target="_blank"
                  className="text-lg font-semibold text-indigo-800 mb-4 underline"
                >
                  Our Whitepaper
                </Link>
                <div className="bg-white/80 rounded-lg p-3 border border-indigo-100">
                  <div className="aspect-w-16 aspect-h-22 rounded-xl overflow-hidden min-h-[300px]">
                    <iframe
                      src="/whitepaper.pdf#view=FitH&toolbar=0&navpanes=0&scrollbar=0"
                      className="w-full h-full"
                      title="Whitepaper Preview"
                      style={{ minHeight: "300px" }}
                    />
                  </div>
                </div>
              </div>

              {/* Token Balance */}
              <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-lg p-3 xs:p-4 sm:p-6 border border-indigo-100">
                <h2 className="text-lg font-semibold text-indigo-800 mb-2">
                  Your {TOKEN_CONSTANTS.SYMBOL} Balance
                </h2>
                <div className="bg-white/80 rounded-lg p-3 border border-indigo-100">
                  <TokenBalance tokenMint={TOKEN_CONSTANTS.MINT_ADDRESS} />
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History - Now below both columns */}
          <div className="mt-8">
            <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-lg p-3 xs:p-4 sm:p-6 border border-indigo-100">
              <h2 className="text-lg font-semibold text-indigo-800 mb-2">
                Transaction History
              </h2>
              <div className="bg-white/80 rounded-lg p-3 border border-indigo-100">
                <TransactionHistory />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
