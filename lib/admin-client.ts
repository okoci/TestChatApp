import type { User } from "firebase/auth";
import { getAuthIdToken, isGoogleSignedIn } from "@/lib/auth";

export function isAdminUser(user: User | null): boolean {
  const adminUid = process.env.NEXT_PUBLIC_ADMIN_UID ?? "";

  if (!user || !adminUid || user.uid !== adminUid) {
    return false;
  }

  return isGoogleSignedIn(user);
}

async function adminFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const token = await getAuthIdToken();
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(input, {
    ...init,
    headers,
  });
}

export async function deleteRoomApi(roomId: string): Promise<void> {
  const response = await adminFetch(
    `/api/admin/rooms/${encodeURIComponent(roomId)}`,
    { method: "DELETE" },
  );

  if (!response.ok) {
    throw new Error("Failed to delete room.");
  }
}

export async function deleteMessageApi(
  roomId: string,
  messageId: string,
): Promise<void> {
  const response = await adminFetch(
    `/api/admin/messages/${encodeURIComponent(roomId)}/${encodeURIComponent(messageId)}`,
    { method: "DELETE" },
  );

  if (!response.ok) {
    throw new Error("Failed to delete message.");
  }
}
