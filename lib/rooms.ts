import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Room } from "@/types/room";

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
