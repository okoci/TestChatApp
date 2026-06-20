"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/types/message";

type MessageListProps = {
  messages: Message[];
  currentUsername: string;
  isAdmin?: boolean;
  isDeletingMessageId?: string | null;
  onDeleteMessage?: (messageId: string) => void;
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
  isAdmin = false,
  isDeletingMessageId = null,
  onDeleteMessage,
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

          const isDeleting = isDeletingMessageId === message.id;

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
                  {isAdmin && onDeleteMessage ? (
                    <button
                      type="button"
                      onClick={() => onDeleteMessage(message.id)}
                      disabled={isDeleting}
                      aria-label="メッセージを削除"
                      className={`ml-auto rounded px-1.5 py-0.5 transition hover:bg-black/10 disabled:cursor-not-allowed disabled:opacity-50 ${
                        isOwnMessage ? "text-white" : "text-red-600"
                      }`}
                    >
                      {isDeleting ? "削除中..." : "削除"}
                    </button>
                  ) : null}
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
