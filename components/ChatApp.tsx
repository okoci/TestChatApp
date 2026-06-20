"use client";

import { useEffect, useState } from "react";
import ChatRoom from "@/components/ChatRoom";
import UsernameForm from "@/components/UsernameForm";
import {
  DEFAULT_ROOM_ID,
  isRoomId,
  type RoomId,
} from "@/types/room";

const USERNAME_STORAGE_KEY = "chat-username";
const ROOM_STORAGE_KEY = "chat-room-id";

export default function ChatApp() {
  const [username, setUsername] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<RoomId>(DEFAULT_ROOM_ID);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedUsername = window.localStorage.getItem(USERNAME_STORAGE_KEY);
    const storedRoomId = window.localStorage.getItem(ROOM_STORAGE_KEY);

    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (storedRoomId && isRoomId(storedRoomId)) {
      setRoomId(storedRoomId);
    }

    setIsReady(true);
  }, []);

  function handleJoin(nextUsername: string) {
    window.localStorage.setItem(USERNAME_STORAGE_KEY, nextUsername);
    setUsername(nextUsername);
  }

  function handleRoomChange(nextRoomId: RoomId) {
    window.localStorage.setItem(ROOM_STORAGE_KEY, nextRoomId);
    setRoomId(nextRoomId);
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

  return (
    <ChatRoom
      username={username}
      roomId={roomId}
      onRoomChange={handleRoomChange}
      onLeave={handleLeave}
    />
  );
}
