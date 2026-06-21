"use client";

import { useCallback, useRef } from "react";

type LongPressHandlers = {
  onPointerDown: () => void;
  onPointerUp: () => void;
  onPointerLeave: () => void;
  onPointerCancel: () => void;
  onContextMenu: (event: React.SyntheticEvent) => void;
  shouldSuppressClick: () => boolean;
};

export function useLongPress(
  onLongPress: () => void,
  delayMs = 700,
): LongPressHandlers {
  const timerRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const onPointerDown = useCallback(() => {
    suppressClickRef.current = false;
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      suppressClickRef.current = true;
      onLongPress();
    }, delayMs);
  }, [clearTimer, delayMs, onLongPress]);

  return {
    onPointerDown,
    onPointerUp: clearTimer,
    onPointerLeave: clearTimer,
    onPointerCancel: clearTimer,
    onContextMenu: (event) => event.preventDefault(),
    shouldSuppressClick: () => suppressClickRef.current,
  };
}
