"use client";

import { useEffect, useState } from "react";
import ChatRoom from "@/components/ChatRoom";
import UsernameForm from "@/components/UsernameForm";

const USERNAME_STORAGE_KEY = "chat-username";

export default function ChatApp() {
  const [username, setUsername] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedUsername = window.localStorage.getItem(USERNAME_STORAGE_KEY);

    if (storedUsername) {
      setUsername(storedUsername);
    }

    setIsReady(true);
  }, []);

  function handleJoin(nextUsername: string) {
    window.localStorage.setItem(USERNAME_STORAGE_KEY, nextUsername);
    setUsername(nextUsername);
  }

  function handleLeave() {
    window.localStorage.removeItem(USERNAME_STORAGE_KEY);
    setUsername(null);
  }

  if (!isReady) {
    return (
      <div className="flex h-dvh items-center justify-center bg-slate-50 text-sm text-slate-500">
        読み込み中...
      </div>
    );
  }

  if (!username) {
    return <UsernameForm onJoin={handleJoin} />;
  }

  return <ChatRoom username={username} onLeave={handleLeave} />;
}
