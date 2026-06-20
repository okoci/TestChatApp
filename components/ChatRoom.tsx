"use client";

import { useEffect, useState } from "react";
import MessageInput from "@/components/MessageInput";
import MessageList from "@/components/MessageList";
import { sendMessage, subscribeMessages } from "@/lib/messages";
import type { Message } from "@/types/message";

type ChatRoomProps = {
  username: string;
  onLeave: () => void;
};

export default function ChatRoom({ username, onLeave }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeMessages((nextMessages) => {
      setMessages(nextMessages);
      setError(null);
    });

    return () => unsubscribe();
  }, []);

  async function handleSend(text: string) {
    try {
      await sendMessage(username, text);
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
          <p className="text-sm text-slate-500">{username} として参加中</p>
        </div>
        <button
          type="button"
          onClick={onLeave}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          退出
        </button>
      </header>

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
