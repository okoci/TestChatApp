import {
  cert,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function parseServiceAccount(): ServiceAccount {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not configured.");
  }

  const parsed = JSON.parse(raw) as ServiceAccount & { private_key?: string };

  if (typeof parsed.private_key === "string" && !parsed.privateKey) {
    parsed.privateKey = parsed.private_key.replace(/\\n/g, "\n");
  } else if (typeof parsed.privateKey === "string") {
    parsed.privateKey = parsed.privateKey.replace(/\\n/g, "\n");
  }

  return parsed;
}

function getAdminApp(): App {
  const existingApp = getApps()[0];

  if (existingApp) {
    return existingApp;
  }

  return initializeApp({
    credential: cert(parseServiceAccount()),
  });
}

export function getAdminFirestore(): Firestore {
  return getFirestore(getAdminApp());
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}
