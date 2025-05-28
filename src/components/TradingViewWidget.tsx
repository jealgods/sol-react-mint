"use client";

import { useEffect, useRef, memo } from "react";

interface TradingViewWidgetProps {
  symbol?: string;
  theme?: "light" | "dark";
  interval?: "1" | "5" | "15" | "30" | "60" | "D" | "W" | "M";
  autosize?: boolean;
  allowSymbolChange?: boolean;
  height?: string;
  width?: string;
}

// Add TradingView types
declare global {
  interface Window {
    TradingView: {
      widget: {
        setSymbol: (symbol: string, interval: string) => void;
        setTheme: (theme: string) => void;
      };
    };
  }
}

type TradingViewScript = HTMLScriptElement;

const TradingViewWidget = ({
  symbol = "COINBASE:SOLUSD",
  theme = "light",
  interval = "D",
  autosize = true,
  allowSymbolChange = true,
  height = "100%",
  width = "100%",
}: TradingViewWidgetProps) => {
  const container = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<TradingViewScript | null>(null);

  useEffect(() => {
    // Initialize widget only once
    if (!widgetRef.current) {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize,
        symbol,
        interval,
        timezone: "Etc/UTC",
        theme,
        style: "3",
        locale: "en",
        allow_symbol_change: allowSymbolChange,
        support_host: "https://www.tradingview.com",
        hide_top_toolbar: false,
        hide_side_toolbar: false,
        save_image: true,
        studies: [],
        container_id: "tradingview_widget",
        enable_publishing: false,
        withdateranges: true,
        range: "12M",
        show_popup_button: false,
        popup_width: "500",
        popup_height: "650",
        details: true,
        hotlist: true,
        calendar: true,
      });

      if (container.current) {
        container.current.appendChild(script);
        widgetRef.current = script;
      }
    }

    // Update widget options when props change
    if (widgetRef.current && window.TradingView) {
      const widget = window.TradingView.widget;
      if (widget) {
        widget.setSymbol(symbol, interval);
        widget.setTheme(theme);
      }
    }

    return () => {
      if (container.current && widgetRef.current) {
        container.current.removeChild(widgetRef.current);
        widgetRef.current = null;
      }
    };
  }, []); // Empty dependency array for initial setup only

  // Handle prop changes
  useEffect(() => {
    if (widgetRef.current && window.TradingView) {
      const widget = window.TradingView.widget;
      if (widget) {
        widget.setSymbol(symbol, interval);
        widget.setTheme(theme);
      }
    }
  }, [symbol, interval, theme]);

  return (
    <div
      className="tradingview-widget-container rounded-full"
      ref={container}
      style={{ height, width }}
    >
      <div
        id="tradingview_widget"
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      />
    </div>
  );
};

export default memo(TradingViewWidget);
