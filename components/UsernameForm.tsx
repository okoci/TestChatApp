"use client";

import { FormEvent, useState } from "react";

type UsernameFormProps = {
  onJoin: (username: string) => void;
};

export default function UsernameForm({ onJoin }: UsernameFormProps) {
  const [username, setUsername] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      return;
    }

    onJoin(trimmedUsername);
  }

  return (
    <div className="flex h-dvh items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">TestChatApp</h1>
        <p className="mt-2 text-sm text-slate-600">
          ユーザー名を入力してチャットルームに参加してください。
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              ユーザー名
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="例: 太郎"
              maxLength={20}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              autoComplete="nickname"
            />
          </div>

          <button
            type="submit"
            className="min-h-11 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            参加する
          </button>
        </form>
      </div>
    </div>
  );
}
