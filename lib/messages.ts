import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Message } from "@/types/message";

const MESSAGES_COLLECTION = "messages";
const MESSAGE_LIMIT = 100;

function toMessage(id: string, data: Record<string, unknown>): Message {
  const createdAt = data.createdAt;

  return {
    id,
    username: String(data.username ?? ""),
    text: String(data.text ?? ""),
    createdAt:
      createdAt instanceof Timestamp ? createdAt.toDate() : new Date(),
  };
}

export function subscribeMessages(callback: (messages: Message[]) => void) {
  const messagesQuery = query(
    collection(db, MESSAGES_COLLECTION),
    orderBy("createdAt", "asc"),
    limit(MESSAGE_LIMIT),
  );

  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map((doc) =>
      toMessage(doc.id, doc.data()),
    );
    callback(messages);
  });
}

export async function sendMessage(username: string, text: string) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return;
  }

  await addDoc(collection(db, MESSAGES_COLLECTION), {
    username,
    text: trimmedText,
    createdAt: serverTimestamp(),
  });
}
