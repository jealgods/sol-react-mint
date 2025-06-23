"use client";

import { usePrivacyPolicy } from "@/hooks/usePrivacyPolicy";
import PrivacyPolicy from "./PrivacyPolicy";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
};

const PrivacyPolicyWrapper = ({
  children,
  title = "Welcome to LongLifeCoin",
  subtitle = "Please review and accept our Privacy Policy to continue",
}: Props) => {
  const { privacyAccepted, isLoading, acceptPrivacyPolicy } =
    usePrivacyPolicy();

  // Preload TradingView chart when privacy policy is shown
  useEffect(() => {
    if (!privacyAccepted && !isLoading) {
      // Preload TradingView script and chart
      const preloadTradingView = () => {
        // Create a hidden iframe to preload the chart
        const iframe = document.createElement("iframe");
        iframe.style.position = "absolute";
        iframe.style.left = "-9999px";
        iframe.style.top = "-9999px";
        iframe.style.width = "1px";
        iframe.style.height = "1px";
        iframe.style.border = "none";
        iframe.style.opacity = "0";
        iframe.src =
          "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.html?symbol=COINBASE%3ASOLUSD&interval=30&theme=dark&style=1&width=100%25&height=100%25";

        document.body.appendChild(iframe);

        // Remove the iframe after a short delay
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 5000);
      };

      // Delay the preload slightly to not interfere with privacy policy rendering
      const timer = setTimeout(preloadTradingView, 1000);

      return () => clearTimeout(timer);
    }
  }, [privacyAccepted, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <main className="flex-1 py-6 px-2 sm:px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-fuchsia-500"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      {children}

      {/* Privacy Policy Modal */}
      {!privacyAccepted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-neutral-900/95 rounded-2xl shadow-2xl border border-neutral-700 p-6">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {title}
                </h1>
                <p className="text-neutral-300 text-base">{subtitle}</p>
              </div>
              <PrivacyPolicy onAccept={acceptPrivacyPolicy} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrivacyPolicyWrapper;
