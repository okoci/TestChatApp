import admin from "firebase-admin";
import type { ServiceAccount } from "firebase-admin";

function parseServiceAccount(): ServiceAccount {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not configured.");
  }

  try {
    const parsed = JSON.parse(raw) as ServiceAccount & { private_key?: string };

    if (typeof parsed.private_key === "string" && !parsed.privateKey) {
      parsed.privateKey = parsed.private_key.replace(/\\n/g, "\n");
    } else if (typeof parsed.privateKey === "string") {
      parsed.privateKey = parsed.privateKey.replace(/\\n/g, "\n");
    }

    return parsed;
  } catch (error) {
    console.error(
      "[Admin SDK] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:",
      error,
    );
    throw error;
  }
}

function ensureAdminApp(): admin.app.App {
  const existingApp = admin.apps[0];

  if (existingApp) {
    return existingApp;
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.cert(parseServiceAccount()),
    });
  } catch (error) {
    console.error("[Admin SDK] App initialization failed:", error);
    throw error;
  }
}

export function getAdminAuth(): admin.auth.Auth {
  try {
    ensureAdminApp();
    return admin.auth();
  } catch (error) {
    console.error("[Admin SDK] Auth initialization failed:", error);
    throw error;
  }
}

export function getAdminFirestore(): admin.firestore.Firestore {
  try {
    ensureAdminApp();
    return admin.firestore();
  } catch (error) {
    console.error("[Admin SDK] Firestore initialization failed:", error);
    throw error;
  }
}
