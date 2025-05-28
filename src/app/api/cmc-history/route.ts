type CoinGeckoResponse = {
  prices: [number, number][]; // [timestamp, price]
  market_caps: [number, number][];
  total_volumes: [number, number][];
};

const symbolToId: Record<string, string> = {
  ETH: "ethereum",
  BTC: "bitcoin",
  SOL: "solana",
  // Add more as needed
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "ETH";
  const range = searchParams.get("range") || "1D";

  const coinId = symbolToId[symbol.toUpperCase()];
  if (!coinId) {
    return Response.json({ error: "Unsupported symbol" }, { status: 400 });
  }

  let days: number;
  let interval: string;

  switch (range) {
    case "1H":
      days = 1;
      interval = "hourly";
      break;
    case "1D":
      days = 1;
      interval = "hourly";
      break;
    case "1W":
      days = 7;
      interval = "daily";
      break;
    case "1M":
      days = 30;
      interval = "daily";
      break;
    case "1Y":
      days = 365;
      interval = "daily";
      break;
    case "ALL":
      days = 365 * 5; // 5 years of data
      interval = "daily";
      break;
    default:
      return Response.json({ error: "Invalid range" }, { status: 400 });
  }

  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      const error = await response.text();
      return Response.json(
        { error: `CoinGecko API error: ${error}` },
        { status: response.status }
      );
    }

    const data: CoinGeckoResponse = await response.json();

    if (
      !data.prices ||
      !Array.isArray(data.prices) ||
      data.prices.length === 0
    ) {
      return Response.json(
        { error: "No price data available" },
        { status: 404 }
      );
    }

    // Process the data to match your existing format
    const chartData = data.prices.map(([timestamp, price]) => ({
      time: new Date(timestamp).toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        ...(range !== "1H" && { month: "short", day: "numeric" }),
      }),
      price: Number(price.toFixed(2)), // Round to 2 decimal places
    }));

    const first = chartData[0]?.price ?? 0;
    const last = chartData[chartData.length - 1]?.price ?? 0;
    const change = Number((last - first).toFixed(2));
    const percent = first ? Number(((change / first) * 100).toFixed(2)) : 0;

    return Response.json({
      chartData,
      priceInfo: {
        price: last,
        change,
        percent,
      },
    });
  } catch (error) {
    console.error("CoinGecko API error:", error);
    return Response.json(
      {
        error: "Failed to fetch data from CoinGecko API",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
