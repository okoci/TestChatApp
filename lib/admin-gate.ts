const ADMIN_GATE_STORAGE_KEY = "admin-gate-unlocked";

export const LOGO_TAP_COUNT = 5;
export const LOGO_TAP_WINDOW_MS = 2000;

export function readAdminGateUnlocked(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return sessionStorage.getItem(ADMIN_GATE_STORAGE_KEY) === "true";
}

export function unlockAdminGate(): void {
  sessionStorage.setItem(ADMIN_GATE_STORAGE_KEY, "true");
}

export function checkAdminQueryParam(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const params = new URLSearchParams(window.location.search);

  if (params.get("admin") !== "1") {
    return false;
  }

  unlockAdminGate();
  params.delete("admin");

  const query = params.toString();
  const nextUrl = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;

  window.history.replaceState({}, "", nextUrl);
  return true;
}
