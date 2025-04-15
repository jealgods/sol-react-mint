import { PublicKey } from "@solana/web3.js";

export interface User {
  id: string;
  name: string;
  email: string;
  walletAddress?: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface WalletState {
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
}
