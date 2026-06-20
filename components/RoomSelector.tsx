"use client";

import { FormEvent, useState } from "react";
import type { Room } from "@/types/room";

type RoomSelectorProps = {
  rooms: Room[];
  activeRoomId: string | null;
  uid: string;
  isCreating: boolean;
  isDeletingRoom?: boolean;
  isAdmin?: boolean;
  onChange: (roomId: string) => void;
  onCreateRoom: (name: string) => Promise<string | null>;
  onDeleteRoom?: (roomId: string) => Promise<void>;
};

export default function RoomSelector({
  rooms,
  activeRoomId,
  uid,
  isCreating,
  isDeletingRoom = false,
  isAdmin = false,
  onChange,
  onCreateRoom,
  onDeleteRoom,
}: RoomSelectorProps) {
  const [roomName, setRoomName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);

  const activeRoom = rooms.find((room) => room.id === activeRoomId);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError(null);

    try {
      const newRoomId = await onCreateRoom(roomName);

      if (newRoomId) {
        setRoomName("");
      }
    } catch (error) {
      console.error(error);
      setCreateError("ルームの作成に失敗しました。");
    }
  }

  return (
    <div className="border-b border-slate-200 bg-white px-2 py-2">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {rooms.length === 0 ? (
          <p className="px-2 py-2 text-sm text-slate-500">
            ルームがありません。下のフォームから作成してください。
          </p>
        ) : (
          rooms.map((room) => {
            const isActive = room.id === activeRoomId;

            return (
              <button
                key={room.id}
                type="button"
                onClick={() => onChange(room.id)}
                className={`min-h-11 shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {room.name}
              </button>
            );
          })
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 px-2">
        <p className="text-xs text-slate-500">
          {activeRoom
            ? `作成者ID: ${activeRoom.ownerId === uid ? "あなた" : activeRoom.ownerId.slice(0, 8)}`
            : "ルームを選択するか、新しく作成してください。"}
        </p>
        {isAdmin && activeRoom && onDeleteRoom ? (
          <button
            type="button"
            onClick={() => onDeleteRoom(activeRoom.id)}
            disabled={isDeletingRoom}
            className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeletingRoom ? "削除中..." : "ルーム削除"}
          </button>
        ) : null}
      </div>

      <form className="mt-3 flex gap-2 px-2" onSubmit={handleCreate}>
        <input
          type="text"
          value={roomName}
          onChange={(event) => setRoomName(event.target.value)}
          placeholder="新しいルーム名"
          maxLength={30}
          className="min-h-11 flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="submit"
          disabled={isCreating || !roomName.trim()}
          className="min-h-11 shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isCreating ? "作成中..." : "ルーム作成"}
        </button>
      </form>

      {createError ? (
        <p className="mt-2 px-2 text-xs text-red-600">{createError}</p>
      ) : null}
    </div>
  );
}
