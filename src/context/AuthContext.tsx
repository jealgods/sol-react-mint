"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { User, WalletState } from "../types";
import { fetchApi } from "../utils/api";
import { API_ENDPOINTS } from "../constants";
import { useWallet } from "@solana/wallet-adapter-react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  walletState: WalletState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { publicKey, connected, connecting, connect, disconnect } = useWallet();

  const walletState: WalletState = {
    publicKey,
    connected,
    connecting,
  };

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetchApi<User>(API_ENDPOINTS.USER.PROFILE);
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const connectWallet = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Wallet connection failed:", error);
      throw error;
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Wallet disconnection failed:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetchApi<User>(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          walletAddress: publicKey?.toBase58(),
        }),
      });
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetchApi(API_ENDPOINTS.AUTH.LOGOUT, { method: "POST" });
      setUser(null);
      await disconnectWallet();
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        walletState,
        login,
        logout,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
