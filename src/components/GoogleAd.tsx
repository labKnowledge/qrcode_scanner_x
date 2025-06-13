// src/components/GoogleAd.tsx
"use client";
import { useEffect } from "react";

// Extend Window interface to include adsbygoogle
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface GoogleAdProps {
  adSlot: string;
  adFormat?: string;
  style?: React.CSSProperties;
}

export default function GoogleAd({
  adSlot,
  adFormat = "auto",
  style,
}: GoogleAdProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", ...style }}
      data-ad-client="ca-pub-7915052561240587"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
    />
  );
}
