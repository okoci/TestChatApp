"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  checkAdminQueryParam,
  LOGO_TAP_COUNT,
  LOGO_TAP_WINDOW_MS,
  readAdminGateUnlocked,
  unlockAdminGate,
} from "@/lib/admin-gate";

export function useAdminGate() {
  const [isAdminGateUnlocked, setIsAdminGateUnlocked] = useState(false);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const unlocked = checkAdminQueryParam() || readAdminGateUnlocked();
    setIsAdminGateUnlocked(unlocked);
  }, []);

  const handleLogoTap = useCallback(() => {
    if (isAdminGateUnlocked) {
      return;
    }

    tapCountRef.current += 1;

    if (tapTimerRef.current !== null) {
      window.clearTimeout(tapTimerRef.current);
    }

    if (tapCountRef.current >= LOGO_TAP_COUNT) {
      unlockAdminGate();
      setIsAdminGateUnlocked(true);
      tapCountRef.current = 0;
      return;
    }

    tapTimerRef.current = window.setTimeout(() => {
      tapCountRef.current = 0;
      tapTimerRef.current = null;
    }, LOGO_TAP_WINDOW_MS);
  }, [isAdminGateUnlocked]);

  useEffect(() => {
    return () => {
      if (tapTimerRef.current !== null) {
        window.clearTimeout(tapTimerRef.current);
      }
    };
  }, []);

  return { isAdminGateUnlocked, handleLogoTap };
}
