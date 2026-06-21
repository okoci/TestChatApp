"use client";

import { FormEvent, useState } from "react";
import { canDeleteRoom } from "@/lib/permissions";
import { useLongPress } from "@/lib/useLongPress";
import type { Room } from "@/types/room";

type RoomSelectorProps = {
  rooms: Room[];
  activeRoomId: string | null;
  uid: string;
  isCreating: boolean;
  isDeletingRoom?: boolean;
  isAdmin?: boolean;
  isMobile?: boolean;
  onChange: (roomId: string) => void;
  onCreateRoom: (name: string) => Promise<string | null>;
  onDeleteRoom?: (roomId: string) => Promise<void>;
};

type RoomTabProps = {
  room: Room;
  isActive: boolean;
  uid: string;
  isAdmin: boolean;
  isMobile: boolean;
  onChange: (roomId: string) => void;
  onDeleteRoom?: (roomId: string) => Promise<void>;
};

function RoomTab({
  room,
  isActive,
  uid,
  isAdmin,
  isMobile,
  onChange,
  onDeleteRoom,
}: RoomTabProps) {
  const deletable = canDeleteRoom(room, uid, isAdmin);

  const longPress = useLongPress(() => {
    if (deletable && onDeleteRoom) {
      void onDeleteRoom(room.id);
    }
  });

  return (
    <button
      type="button"
      onClick={(event) => {
        if (isMobile && longPress.shouldSuppressClick()) {
          event.preventDefault();
          return;
        }

        onChange(room.id);
      }}
      className={`min-h-11 shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition ${
        isActive
          ? "bg-blue-600 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      } ${deletable && isMobile ? "select-none touch-manipulation" : ""}`}
      {...(deletable && isMobile
        ? {
            onPointerDown: longPress.onPointerDown,
            onPointerUp: longPress.onPointerUp,
            onPointerLeave: longPress.onPointerLeave,
            onPointerCancel: longPress.onPointerCancel,
            onContextMenu: longPress.onContextMenu,
          }
        : {})}
    >
      {room.name}
    </button>
  );
}

export default function RoomSelector({
  rooms,
  activeRoomId,
  uid,
  isCreating,
  isDeletingRoom = false,
  isAdmin = false,
  isMobile = false,
  onChange,
  onCreateRoom,
  onDeleteRoom,
}: RoomSelectorProps) {
  const [roomName, setRoomName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);

  const activeRoom = rooms.find((room) => room.id === activeRoomId);
  const canDeleteActiveRoom = activeRoom
    ? canDeleteRoom(activeRoom, uid, isAdmin)
    : false;

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
          rooms.map((room) => (
            <RoomTab
              key={room.id}
              room={room}
              isActive={room.id === activeRoomId}
              uid={uid}
              isAdmin={isAdmin}
              isMobile={isMobile}
              onChange={onChange}
              onDeleteRoom={onDeleteRoom}
            />
          ))
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 px-2">
        <p className="text-xs text-slate-500">
          {activeRoom
            ? `作成者ID: ${activeRoom.ownerId === uid ? "あなた" : activeRoom.ownerId.slice(0, 8)}`
            : "ルームを選択するか、新しく作成してください。"}
        </p>
        {canDeleteActiveRoom && !isMobile && activeRoom && onDeleteRoom ? (
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
