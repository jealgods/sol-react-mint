import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://longlifecoin.com"),
  title: {
    default: "LongLifeCoin (LLC) - Solana Token Trading Platform",
    template: "%s | LongLifeCoin",
  },
  description:
    "Trade LongLifeCoin (LLC) tokens on Solana blockchain. Buy and sell LLC tokens with real-time price updates and secure wallet integration.",
  keywords: [
    "LongLifeCoin",
    "LLC",
    "Solana",
    "crypto",
    "trading",
    "token",
    "blockchain",
  ],
  authors: [{ name: "LongLifeCoin Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://longlifecoin.com",
    siteName: "LongLifeCoin",
    title: "LongLifeCoin (LLC) - Solana Token Trading Platform",
    description:
      "Trade LongLifeCoin (LLC) tokens on Solana blockchain. Buy and sell LLC tokens with real-time price updates and secure wallet integration.",
    images: [
      {
        url: "/images/longlifecoin-og.png",
        width: 1200,
        height: 630,
        alt: "LongLifeCoin Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LongLifeCoin (LLC) - Solana Token Trading Platform",
    description:
      "Trade LongLifeCoin (LLC) tokens on Solana blockchain. Buy and sell LLC tokens with real-time price updates and secure wallet integration.",
    images: ["/images/longlifecoin-og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add your Google verification code
  },
};
