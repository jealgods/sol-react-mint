"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_CONSTANTS } from "@/constants/token";

interface Transaction {
  id: string;
  type: "buy" | "sell";
  amount: number;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
}

export const TransactionHistory = () => {
  const { publicKey } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!publicKey) return;

      try {
        // Implement your transaction fetching logic here
        // This is just example data
        const mockTransactions: Transaction[] = [
          {
            id: "1",
            type: "buy",
            amount: 100,
            timestamp: new Date(),
            status: "completed",
          },
        ];
        setTransactions(mockTransactions);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, [publicKey]);

  return (
    <div className="mt-2">
      <h2 className="text-xl font-bold mb-4">
        {TOKEN_CONSTANTS.SYMBOL} Transaction History
      </h2>
      <div className="space-y-2">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-gray-50 p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-medium">
                {tx.type === "buy" ? "Bought" : "Sold"} {tx.amount}{" "}
                {TOKEN_CONSTANTS.SYMBOL}
              </p>
              <p className="text-sm text-gray-600">
                {tx.timestamp.toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded text-sm ${
                tx.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : tx.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {tx.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
