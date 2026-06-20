import { getAdminFirestore } from "@/lib/firebase-admin";

export async function deleteMessage(
  roomId: string,
  messageId: string,
): Promise<void> {
  const db = getAdminFirestore();
  const messageRef = db
    .collection("rooms")
    .doc(roomId)
    .collection("messages")
    .doc(messageId);
  const messageSnapshot = await messageRef.get();

  if (!messageSnapshot.exists) {
    throw new Error("Message not found.");
  }

  await messageRef.delete();
}
