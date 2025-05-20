"use client";

import Image from "next/image";
import Link from "next/link";
import { TOKEN_CONSTANTS } from "../constants/token";

export const Header = () => {
  return (
    <header className=" bg-slate-800/50 backdrop-blur-xl border-b border-purple-500/20  ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <Link
            href="/"
            className="bg-gradient-to-br from-purple-500 to-pink-500 p-1.5 rounded-full shadow-md"
          >
            <Image
              src="/images/longlifecoin.svg"
              alt={`${TOKEN_CONSTANTS.NAME} Logo`}
              width={36}
              height={36}
              className="rounded-full"
            />
          </Link>
          {/* Hamburger for mobile */}
          {/* <div className="sm:hidden ml-auto">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              aria-label="Open main menu"
              // onClick={handleOpenMenu} // implement this if you have a menu
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div> */}
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {TOKEN_CONSTANTS.NAME} ({TOKEN_CONSTANTS.SYMBOL})
            </h1>
            <p className="text-xs text-slate-400">Help health of people</p>
            {/* <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-700/80 text-white">
                DeFi
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-pink-600/80 text-white">
                Solana
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-600/80 text-white">
                Health
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-600/80 text-white">
                Token
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </header>
  );
};
