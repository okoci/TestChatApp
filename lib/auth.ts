import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";

export function isGoogleSignedIn(user: User | null): boolean {
  return (
    user?.providerData.some((provider) => provider.providerId === "google.com") ??
    false
  );
}

export async function ensureAnonymousAuth(): Promise<User> {
  await auth.authStateReady();

  if (auth.currentUser) {
    return auth.currentUser;
  }

  const credential = await signInAnonymously(auth);
  return credential.user;
}

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  return credential.user;
}

export async function signOutToAnonymous(): Promise<User> {
  await signOut(auth);
  return ensureAnonymousAuth();
}

export function subscribeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getAuthIdToken(): Promise<string> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Not authenticated.");
  }

  return user.getIdToken();
}
