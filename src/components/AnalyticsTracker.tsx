"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track if it's not an admin page (optional, but usually good)
    if (pathname && !pathname.startsWith("/admin")) {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "PAGE_VIEW",
          path: pathname,
        }),
      }).catch((e) => {
        // Silently fail if tracking is blocked (e.g. by adblockers)
        console.warn("Analytics blocked or failed");
      });
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}
