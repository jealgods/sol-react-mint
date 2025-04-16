"use client";

import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_CONSTANTS } from "../constants/token";

interface TokenBalanceProps {
  tokenMint: string;
}

export const TokenBalance = ({ tokenMint }: TokenBalanceProps) => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const getBalance = async () => {
      if (!publicKey) return;

      try {
        // Implement actual token balance fetch here
        const tokenBalance = 0; // Replace with actual balance fetch
        setBalance(tokenBalance);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    };

    getBalance();
  }, [publicKey, connection, tokenMint]);

  const usdValue =
    balance !== null ? balance * TOKEN_CONSTANTS.INITIAL_PRICE_USD : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Token Balance</p>
          <p className="text-lg font-bold text-indigo-800">
            {balance !== null ? balance.toLocaleString() : "---"}{" "}
            {TOKEN_CONSTANTS.SYMBOL}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">USD Value</p>
          <p className="text-lg font-bold text-purple-800">
            ${usdValue !== null ? usdValue.toFixed(2) : "---"}
          </p>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
    </div>
  );
};
