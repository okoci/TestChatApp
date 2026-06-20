"use client";

import { useEffect, useState } from "react";
import MessageInput from "@/components/MessageInput";
import MessageList from "@/components/MessageList";
import RoomSelector from "@/components/RoomSelector";
import { sendMessage, subscribeMessages } from "@/lib/messages";
import { createRoom, subscribeRooms } from "@/lib/rooms";
import type { Message } from "@/types/message";
import type { Room } from "@/types/room";

type ChatRoomProps = {
  username: string;
  clientId: string;
  roomId: string | null;
  onRoomChange: (roomId: string | null) => void;
  onLeave: () => void;
};

export default function ChatRoom({
  username,
  clientId,
  roomId,
  onRoomChange,
  onLeave,
}: ChatRoomProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const activeRoom = rooms.find((room) => room.id === roomId) ?? null;

  useEffect(() => {
    const unsubscribe = subscribeRooms((nextRooms) => {
      setRooms(nextRooms);

      if (nextRooms.length === 0) {
        if (roomId) {
          onRoomChange(null);
        }
        return;
      }

      const hasActiveRoom = roomId
        ? nextRooms.some((room) => room.id === roomId)
        : false;

      if (!hasActiveRoom) {
        onRoomChange(nextRooms[0].id);
      }
    });

    return () => unsubscribe();
  }, [roomId, onRoomChange]);

  useEffect(() => {
    const roomExists = roomId
      ? rooms.some((room) => room.id === roomId)
      : false;

    if (!roomId || !roomExists) {
      setMessages([]);
      return;
    }

    setMessages([]);

    const unsubscribe = subscribeMessages(roomId, (nextMessages) => {
      setMessages(nextMessages);
      setError(null);
    });

    return () => unsubscribe();
  }, [roomId, rooms]);

  async function handleSend(text: string) {
    if (!roomId) {
      return;
    }

    try {
      await sendMessage(roomId, username, text);
      setError(null);
    } catch (sendError) {
      console.error(sendError);
      setError("メッセージの送信に失敗しました。");
    }
  }

  async function handleCreateRoom(name: string) {
    setIsCreating(true);

    try {
      const newRoomId = await createRoom(name, clientId);
      onRoomChange(newRoomId);
      setError(null);
      return newRoomId;
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-lg flex-col bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">TestChatApp</h1>
          <p className="text-sm text-slate-500">
            {username} ・ {activeRoom?.name ?? "ルーム未選択"}
          </p>
        </div>
        <button
          type="button"
          onClick={onLeave}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          退出
        </button>
      </header>

      <RoomSelector
        rooms={rooms}
        activeRoomId={roomId}
        clientId={clientId}
        isCreating={isCreating}
        onChange={onRoomChange}
        onCreateRoom={handleCreateRoom}
      />

      {error ? (
        <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {roomId ? (
        <>
          <MessageList messages={messages} currentUsername={username} />
          <MessageInput onSend={handleSend} />
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center px-4 text-sm text-slate-500">
          ルームを作成するとチャットを開始できます。
        </div>
      )}
    </div>
  );
}
