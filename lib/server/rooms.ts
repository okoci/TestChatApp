import { getAdminFirestore } from "@/lib/firebase-admin";

export async function deleteRoom(roomId: string): Promise<void> {
  const db = await getAdminFirestore();
  const roomRef = db.collection("rooms").doc(roomId);
  const roomSnapshot = await roomRef.get();

  if (!roomSnapshot.exists) {
    throw new Error("Room not found.");
  }

  await db.recursiveDelete(roomRef);
}
