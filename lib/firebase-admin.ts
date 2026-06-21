import {
  cert,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import type { Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";

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

function getAdminApp(): App {
  const existingApp = getApps()[0];

  if (existingApp) {
    return existingApp;
  }

  try {
    return initializeApp({
      credential: cert(parseServiceAccount()),
    });
  } catch (error) {
    console.error("[Admin SDK] App initialization failed:", error);
    throw error;
  }
}

export async function getAdminFirestore(): Promise<Firestore> {
  try {
    const { getFirestore } = await import("firebase-admin/firestore");
    return getFirestore(getAdminApp());
  } catch (error) {
    console.error("[Admin SDK] Firestore initialization failed:", error);
    throw error;
  }
}

export async function getAdminAuth(): Promise<Auth> {
  try {
    const { getAuth } = await import("firebase-admin/auth");
    return getAuth(getAdminApp());
  } catch (error) {
    console.error("[Admin SDK] Auth initialization failed:", error);
    throw error;
  }
}
