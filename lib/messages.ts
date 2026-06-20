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
import type { RoomId } from "@/types/room";

const MESSAGE_LIMIT = 100;

function getMessagesCollection(roomId: RoomId) {
  return collection(db, "rooms", roomId, "messages");
}

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

export function subscribeMessages(
  roomId: RoomId,
  callback: (messages: Message[]) => void,
) {
  const messagesQuery = query(
    getMessagesCollection(roomId),
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

export async function sendMessage(
  roomId: RoomId,
  username: string,
  text: string,
) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return;
  }

  await addDoc(getMessagesCollection(roomId), {
    username,
    text: trimmedText,
    createdAt: serverTimestamp(),
  });
}
