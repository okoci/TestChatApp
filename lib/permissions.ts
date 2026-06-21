import type { Message } from "@/types/message";
import type { Room } from "@/types/room";

export function canDeleteMessage(
  message: Message,
  currentUid: string,
  isAdmin: boolean,
): boolean {
  if (isAdmin) {
    return true;
  }

  return Boolean(message.uid) && message.uid === currentUid;
}

export function canDeleteRoom(
  room: Room,
  currentUid: string,
  isAdmin: boolean,
): boolean {
  if (isAdmin) {
    return true;
  }

  return room.ownerId === currentUid;
}
