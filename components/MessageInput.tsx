"use client";

import { FormEvent, useState } from "react";

type MessageInputProps = {
  onSend: (text: string) => Promise<void>;
  disabled?: boolean;
};

export default function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText || isSending || disabled) {
      return;
    }

    setIsSending(true);

    try {
      await onSend(trimmedText);
      setText("");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-slate-200 bg-white px-4 py-3"
    >
      <div className="flex items-end gap-2">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="メッセージを入力"
          rows={1}
          maxLength={500}
          disabled={disabled || isSending}
          className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
        />
        <button
          type="submit"
          disabled={disabled || isSending || !text.trim()}
          className="min-h-11 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          送信
        </button>
      </div>
    </form>
  );
}
