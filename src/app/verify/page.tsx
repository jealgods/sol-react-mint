"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneVerification } from "@/components/PhoneVerification";
import Image from "next/image";
import { TOKEN_CONSTANTS } from "@/constants/token";

export default function VerifyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const response = await fetch("/api/verify/status");
        const data = await response.json();
        if (data.verified) {
          router.replace("/trade");
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkVerification();
  }, [router]);

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-16">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6">
        <div className="bg-white/90 rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg shadow-md">
                <Image
                  src="/images/longlifecoin.svg"
                  alt={`${TOKEN_CONSTANTS.NAME} Logo`}
                  width={36}
                  height={36}
                  className="rounded-md"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Phone Verification
                </h2>
                <p className="text-xs text-indigo-500">
                  Secure access to trading platform
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <p className="text-indigo-600">
                Please verify your phone number to access the trading platform
              </p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-lg p-4 border border-indigo-100">
              <PhoneVerification
                onVerificationComplete={() => router.replace("/trade")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
