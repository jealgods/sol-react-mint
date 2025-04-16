"use client";

import Image from "next/image";
import Link from "next/link";
import { TOKEN_CONSTANTS } from "../constants/token";

export const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <Link
            href="/"
            className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg shadow-md"
          >
            <Image
              src="/images/longlifecoin.svg"
              alt={`${TOKEN_CONSTANTS.NAME} Logo`}
              width={36}
              height={36}
              className="rounded-md"
            />
          </Link>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {TOKEN_CONSTANTS.NAME} ({TOKEN_CONSTANTS.SYMBOL})
            </h1>
            <p className="text-xs text-indigo-500">
              Secure and instant trading
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
