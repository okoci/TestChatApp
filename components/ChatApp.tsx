"use client";

import { useCallback, useEffect, useState } from "react";
import ChatRoom from "@/components/ChatRoom";
import UsernameForm from "@/components/UsernameForm";
import { getOrCreateClientId } from "@/lib/clientId";

const USERNAME_STORAGE_KEY = "chat-username";
const ROOM_STORAGE_KEY = "chat-room-id";

export default function ChatApp() {
  const [username, setUsername] = useState<string | null>(null);
  const [clientId, setClientId] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedUsername = window.localStorage.getItem(USERNAME_STORAGE_KEY);
    const storedRoomId = window.localStorage.getItem(ROOM_STORAGE_KEY);

    setClientId(getOrCreateClientId());

    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (storedRoomId) {
      setRoomId(storedRoomId);
    }

    setIsReady(true);
  }, []);

  const handleRoomChange = useCallback((nextRoomId: string | null) => {
    if (nextRoomId) {
      window.localStorage.setItem(ROOM_STORAGE_KEY, nextRoomId);
    } else {
      window.localStorage.removeItem(ROOM_STORAGE_KEY);
    }
    setRoomId(nextRoomId);
  }, []);

  function handleJoin(nextUsername: string) {
    window.localStorage.setItem(USERNAME_STORAGE_KEY, nextUsername);
    setUsername(nextUsername);
  }

  function handleLeave() {
    window.localStorage.removeItem(USERNAME_STORAGE_KEY);
    setUsername(null);
  }

  if (!isReady || !clientId) {
    return (
      <div className="flex h-dvh items-center justify-center bg-slate-50 text-sm text-slate-500">
        読み込み中...
      </div>
    );
  }

  if (!username) {
    return <UsernameForm onJoin={handleJoin} />;
  }

  return (
    <ChatRoom
      username={username}
      clientId={clientId}
      roomId={roomId}
      onRoomChange={handleRoomChange}
      onLeave={handleLeave}
    />
  );
}
