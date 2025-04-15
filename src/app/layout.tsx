import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist } from "next/font/google";
import { WalletProvider } from "../providers/WalletProvider";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";
import { metadata as siteMetadata } from "./metadata";

const inter = Inter({ subsets: ["latin"] });
const geistSans = Geist({ subsets: ["latin"] });

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/images/longlifecoin.svg" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/longlifecoin.svg"
        />
      </head>
      <body className={`${geistSans.className} ${inter.className} antialiased`}>
        <WalletProvider>
          <AuthProvider>{children}</AuthProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
