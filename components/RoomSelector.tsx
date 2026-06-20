"use client";

import { ROOMS, type RoomId } from "@/types/room";

type RoomSelectorProps = {
  activeRoomId: RoomId;
  onChange: (roomId: RoomId) => void;
};

export default function RoomSelector({
  activeRoomId,
  onChange,
}: RoomSelectorProps) {
  return (
    <div className="border-b border-slate-200 bg-white px-2 py-2">
      <div className="flex gap-2 overflow-x-auto">
        {ROOMS.map((room) => {
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
              {room.label}
            </button>
          );
        })}
      </div>
      <p className="mt-2 px-2 text-xs text-slate-500">
        {ROOMS.find((room) => room.id === activeRoomId)?.description}
      </p>
    </div>
  );
}
