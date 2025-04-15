"use client";

import { useState } from "react";

interface PhoneVerificationProps {
  onVerificationComplete?: () => void;
}

export function PhoneVerification({
  onVerificationComplete,
}: PhoneVerificationProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!phoneNumber) {
      setMessage("Please enter a phone number");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        setStep("code");
        setMessage("Verification code sent!");
      } else {
        setMessage(data.error || "Failed to send verification code");
      }
    } catch {
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setMessage("Please enter the verification code");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, code: verificationCode }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Phone number verified successfully!");
        onVerificationComplete?.();
      } else {
        setMessage(data.error || "Invalid verification code");
      }
    } catch {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {step === "phone" ? (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-indigo-600">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 555-5555"
                className="w-full p-2 text-sm border border-indigo-200 rounded-lg bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <button
            onClick={handleSendCode}
            disabled={loading}
            className="w-full py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-indigo-600">
              Verification Code
            </label>
            <div className="relative">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full p-2 text-sm border border-indigo-200 rounded-lg bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <button
            onClick={handleVerifyCode}
            disabled={loading}
            className="w-full py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </div>
      )}

      {message && (
        <div
          className={`p-2 rounded-lg text-xs text-center ${
            message.includes("success") || message.includes("sent")
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
