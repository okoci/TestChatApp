import { getAdminAuth } from "@/lib/firebase-admin";

export async function verifyAdminRequest(request: Request): Promise<boolean> {
  const authHeader = request.headers.get("Authorization");
  const adminUid = process.env.ADMIN_UID;

  if (!authHeader?.startsWith("Bearer ") || !adminUid) {
    return false;
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);

    return (
      decoded.uid === adminUid &&
      decoded.firebase.sign_in_provider === "google.com"
    );
  } catch {
    return false;
  }
}

export function unauthorizedResponse() {
  return Response.json({ error: "Forbidden" }, { status: 403 });
}
