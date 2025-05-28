"use client";

import Image from "next/image";
import Link from "next/link";
import { TOKEN_CONSTANTS } from "../constants/token";
import dynamic from "next/dynamic";

// Dynamically import the wallet button with no SSR
const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

export const Header = () => {
  return (
    <header className="bg-black/90 backdrop-blur-xl border-b border-neutral-800">
      <div className="max-w-full mx-auto px-6 sm:px-12 lg:px-24 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="bg-gradient-to-br from-blue-600 via-violet-700 to-fuchsia-600 p-2 rounded-full shadow-md"
            >
              <Image
                src="/images/longlifecoin.svg"
                alt={`${TOKEN_CONSTANTS.NAME} Logo`}
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>

            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
                {TOKEN_CONSTANTS.NAME}{" "}
                <span className="font-normal text-base text-neutral-400">
                  ({TOKEN_CONSTANTS.SYMBOL})
                </span>
              </h1>
              <p className="text-xs text-neutral-300 mt-1">
                Help health of people
              </p>
            </div>
          </div>
          <div className="w-full sm:w-auto flex sm:justify-end items-center mt-4 sm:mt-0">
            <WalletMultiButton className="!w-full sm:!w-auto !bg-gradient-to-r from-blue-600 to-fuchsia-600 hover:from-blue-700 hover:to-fuchsia-700 !rounded-xl !shadow-lg !text-base !font-semibold !text-white !px-6 !py-2" />
          </div>
        </div>
      </div>
    </header>
  );
};
