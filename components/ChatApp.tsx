"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import ChatRoom from "@/components/ChatRoom";
import UsernameForm from "@/components/UsernameForm";
import { ensureAnonymousAuth, subscribeAuth } from "@/lib/auth";

const USERNAME_STORAGE_KEY = "chat-username";
const ROOM_STORAGE_KEY = "chat-room-id";

export default function ChatApp() {
  const [username, setUsername] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        await ensureAnonymousAuth();
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setAuthError(
            "匿名認証に失敗しました。ページを再読み込みしてください。",
          );
        }
      }
    }

    const unsubscribe = subscribeAuth((nextUser) => {
      if (cancelled) {
        return;
      }

      setUser(nextUser);

      if (nextUser) {
        setAuthError(null);
      }
    });

    void initialize();

    const storedUsername = window.localStorage.getItem(USERNAME_STORAGE_KEY);
    const storedRoomId = window.localStorage.getItem(ROOM_STORAGE_KEY);

    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (storedRoomId) {
      setRoomId(storedRoomId);
    }

    setIsReady(true);

    return () => {
      cancelled = true;
      unsubscribe();
    };
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

  if (!isReady) {
    return (
      <div className="flex h-dvh items-center justify-center bg-slate-50 text-sm text-slate-500">
        読み込み中...
      </div>
    );
  }

  if (authError || !user) {
    return (
      <div className="flex h-dvh items-center justify-center bg-slate-50 px-4 text-center text-sm text-red-600">
        {authError ?? "認証情報を取得できませんでした。"}
      </div>
    );
  }

  if (!username) {
    return <UsernameForm onJoin={handleJoin} />;
  }

  return (
    <ChatRoom
      username={username}
      user={user}
      roomId={roomId}
      onRoomChange={handleRoomChange}
      onLeave={handleLeave}
    />
  );
}
