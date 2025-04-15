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
    <div className="bg-gray-50 p-4 rounded">
      <p className="text-sm text-gray-600">{TOKEN_CONSTANTS.SYMBOL} Balance</p>
      <p className="text-xl font-bold">
        {balance !== null ? balance.toLocaleString() : "---"}{" "}
        {TOKEN_CONSTANTS.SYMBOL}
      </p>
      <p className="text-sm text-gray-600">
        ≈ ${usdValue !== null ? usdValue.toFixed(2) : "---"} USD
      </p>
    </div>
  );
};
