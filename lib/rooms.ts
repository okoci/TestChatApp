import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Room } from "@/types/room";

const DELETE_BATCH_SIZE = 500;

function toRoom(id: string, data: Record<string, unknown>): Room {
  const createdAt = data.createdAt;

  return {
    id,
    name: String(data.name ?? ""),
    ownerId: String(data.ownerId ?? ""),
    createdAt:
      createdAt instanceof Timestamp ? createdAt.toDate() : new Date(),
  };
}

export function subscribeRooms(callback: (rooms: Room[]) => void) {
  const roomsQuery = query(
    collection(db, "rooms"),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(roomsQuery, (snapshot) => {
    const rooms = snapshot.docs.map((doc) => toRoom(doc.id, doc.data()));
    callback(rooms);
  });
}

export async function createRoom(name: string, ownerId: string) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("Room name is required.");
  }

  const docRef = await addDoc(collection(db, "rooms"), {
    name: trimmedName,
    ownerId,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

async function deleteAllMessages(roomId: string) {
  const messagesRef = collection(db, "rooms", roomId, "messages");

  while (true) {
    const snapshot = await getDocs(
      query(messagesRef, orderBy("createdAt", "asc"), limit(DELETE_BATCH_SIZE)),
    );

    if (snapshot.empty) {
      return;
    }

    const batch = writeBatch(db);
    snapshot.docs.forEach((messageDoc) => batch.delete(messageDoc.ref));
    await batch.commit();
  }
}

export async function deleteOwnRoom(roomId: string) {
  await deleteAllMessages(roomId);
  await deleteDoc(doc(db, "rooms", roomId));
}
