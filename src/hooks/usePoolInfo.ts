import { useState, useEffect } from "react";

interface PoolInfo {
  solBalance: number;
  llcBalance: number;
  llcPriceSOL: number; // Price in SOL
  llcPriceUSD: number; // Price in USD
  solPriceUSD: number; // SOL price in USD
  autoSwapEnabled: boolean;
}

export const usePoolInfo = () => {
  const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPoolInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        "https://longlifecoin.com/api/wallet/pool-info"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch pool info");
      }

      const data = await response.json();
      setPoolInfo(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch pool info"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoolInfo();

    // Refresh every 30 seconds
    const interval = setInterval(fetchPoolInfo, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    poolInfo,
    loading,
    error,
    refetch: fetchPoolInfo,
  };
};
