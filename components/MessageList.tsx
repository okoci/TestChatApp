"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/types/message";

type MessageListProps = {
  messages: Message[];
  currentUsername: string;
};

function formatTime(date: Date) {
  return date.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageList({
  messages,
  currentUsername,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
      {messages.length === 0 ? (
        <p className="text-center text-sm text-slate-500">
          まだメッセージはありません。最初の一言を送ってみましょう。
        </p>
      ) : (
        messages.map((message) => {
          const isOwnMessage = message.username === currentUsername;

          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                  isOwnMessage
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-900"
                }`}
              >
                <div className="mb-1 flex items-center gap-2 text-xs opacity-80">
                  <span className="font-semibold">{message.username}</span>
                  <span>{formatTime(message.createdAt)}</span>
                </div>
                <p className="break-words text-sm leading-6">{message.text}</p>
              </div>
            </div>
          );
        })
      )}
      <div ref={bottomRef} />
    </div>
  );
}
