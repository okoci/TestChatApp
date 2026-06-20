"use client";

import { useEffect, useState } from "react";
import MessageInput from "@/components/MessageInput";
import MessageList from "@/components/MessageList";
import RoomSelector from "@/components/RoomSelector";
import { sendMessage, subscribeMessages } from "@/lib/messages";
import type { Message } from "@/types/message";
import { getRoomById, type RoomId } from "@/types/room";

type ChatRoomProps = {
  username: string;
  roomId: RoomId;
  onRoomChange: (roomId: RoomId) => void;
  onLeave: () => void;
};

export default function ChatRoom({
  username,
  roomId,
  onRoomChange,
  onLeave,
}: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const activeRoom = getRoomById(roomId);

  useEffect(() => {
    setMessages([]);

    const unsubscribe = subscribeMessages(roomId, (nextMessages) => {
      setMessages(nextMessages);
      setError(null);
    });

    return () => unsubscribe();
  }, [roomId]);

  async function handleSend(text: string) {
    try {
      await sendMessage(roomId, username, text);
      setError(null);
    } catch (sendError) {
      console.error(sendError);
      setError("メッセージの送信に失敗しました。");
    }
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-lg flex-col bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">TestChatApp</h1>
          <p className="text-sm text-slate-500">
            {username} ・ {activeRoom?.label ?? roomId}
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

      <RoomSelector activeRoomId={roomId} onChange={onRoomChange} />

      {error ? (
        <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <MessageList messages={messages} currentUsername={username} />
      <MessageInput onSend={handleSend} />
    </div>
  );
}
