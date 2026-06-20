export const ROOMS = [
  {
    id: "general",
    label: "一般",
    description: "みんなで雑談するルーム",
  },
  {
    id: "game",
    label: "ゲーム",
    description: "ゲームについて話すルーム",
  },
  {
    id: "study",
    label: "勉強",
    description: "勉強・学習の相談ルーム",
  },
] as const;

export type RoomId = (typeof ROOMS)[number]["id"];

export const DEFAULT_ROOM_ID: RoomId = "general";

export const ROOM_IDS: RoomId[] = ROOMS.map((room) => room.id);

export function getRoomById(roomId: string) {
  return ROOMS.find((room) => room.id === roomId);
}

export function isRoomId(value: string): value is RoomId {
  return ROOM_IDS.includes(value as RoomId);
}
