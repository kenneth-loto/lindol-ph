import { useSyncExternalStore } from "react";
import { MOBILE_QUERY } from "@/lib/constants";

let mql: MediaQueryList | null = null;

function getMediaQuery(): MediaQueryList | null {
  if (typeof window === "undefined") return null;

  if (!mql) mql = window.matchMedia(MOBILE_QUERY);

  return mql;
}

/**
 * Returns `true` if the viewport width is below the mobile breakpoint (768px).
 *
 * Uses a module-level `MediaQueryList` singleton to avoid recreating the query
 * on every render. Defaults to `false` on the server (SSR).
 *
 * @example
 * const isMobile = useIsMobile();
 * if (isMobile) return <MobileNav />;
 */
export function useIsMobile() {
  return useSyncExternalStore(
    (callback) => {
      const mq = getMediaQuery();

      mq?.addEventListener("change", callback);

      return () => mq?.removeEventListener("change", callback);
    },
    () => getMediaQuery()?.matches ?? false,
    () => false,
  );
}
