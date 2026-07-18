"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track if it's not an admin page (optional, but usually good)
    if (pathname && !pathname.startsWith("/admin")) {
      
      // Get or create a unique device ID for the visitor
      let deviceId = localStorage.getItem("bds_device_id");
      if (!deviceId) {
        deviceId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem("bds_device_id", deviceId);
      }

      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "PAGE_VIEW",
          path: pathname,
          deviceId: deviceId,
        }),
      }).catch((e) => {
        // Silently fail if tracking is blocked (e.g. by adblockers)
        console.warn("Analytics blocked or failed");
      });
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}
