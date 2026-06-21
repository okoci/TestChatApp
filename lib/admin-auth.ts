import { getAdminAuth } from "@/lib/firebase-admin";

export async function verifyAdminRequest(request: Request): Promise<boolean> {
  const authHeader = request.headers.get("Authorization");
  const adminUid = process.env.ADMIN_UID;

  if (!adminUid) {
    console.error("[Admin Auth] ADMIN_UID is not configured.");
    return false;
  }

  if (!authHeader?.startsWith("Bearer ")) {
    console.error("[Admin Auth] Missing or invalid Authorization header.");
    return false;
  }

  const token = authHeader.slice("Bearer ".length);

  let decoded;

  try {
    const adminAuth = await getAdminAuth();
    decoded = await adminAuth.verifyIdToken(token);
  } catch (error) {
    console.error("[Admin Auth] Token verification failed:", error);
    return false;
  }

  if (decoded.firebase.sign_in_provider !== "google.com") {
    console.error(
      "[Admin Auth] Invalid sign-in provider:",
      decoded.firebase.sign_in_provider,
    );
    return false;
  }

  if (decoded.uid !== adminUid) {
    console.error("[Admin Auth] ADMIN_UID mismatch:", {
      tokenUid: decoded.uid,
      configuredAdminUid: adminUid,
    });
    return false;
  }

  return true;
}

export function unauthorizedResponse() {
  return Response.json({ error: "Forbidden" }, { status: 403 });
}
