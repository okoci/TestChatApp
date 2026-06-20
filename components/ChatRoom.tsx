"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import AdminAuthPanel from "@/components/AdminAuthPanel";
import MessageInput from "@/components/MessageInput";
import MessageList from "@/components/MessageList";
import RoomSelector from "@/components/RoomSelector";
import {
  deleteMessageApi,
  deleteRoomApi,
  isAdminUser,
} from "@/lib/admin-client";
import {
  isGoogleSignedIn,
  signInWithGoogle,
  signOutToAnonymous,
} from "@/lib/auth";
import { useAdminGate } from "@/lib/useAdminGate";
import { sendMessage, subscribeMessages } from "@/lib/messages";
import { createRoom, subscribeRooms } from "@/lib/rooms";
import type { Message } from "@/types/message";
import type { Room } from "@/types/room";

type ChatRoomProps = {
  username: string;
  user: User;
  roomId: string | null;
  onRoomChange: (roomId: string | null) => void;
  onLeave: () => void;
};

export default function ChatRoom({
  username,
  user,
  roomId,
  onRoomChange,
  onLeave,
}: ChatRoomProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [authActionError, setAuthActionError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeletingRoom, setIsDeletingRoom] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(
    null,
  );
  const [isAuthActionLoading, setIsAuthActionLoading] = useState(false);

  const { isAdminGateUnlocked, handleLogoTap } = useAdminGate();
  const isAdmin = isAdminUser(user);
  const googleSignedIn = isGoogleSignedIn(user);
  const activeRoom = rooms.find((room) => room.id === roomId) ?? null;

  useEffect(() => {
    const unsubscribe = subscribeRooms((nextRooms) => {
      setRooms(nextRooms);

      if (nextRooms.length === 0) {
        if (roomId) {
          onRoomChange(null);
        }
        return;
      }

      const hasActiveRoom = roomId
        ? nextRooms.some((room) => room.id === roomId)
        : false;

      if (!hasActiveRoom) {
        onRoomChange(nextRooms[0].id);
      }
    });

    return () => unsubscribe();
  }, [roomId, onRoomChange]);

  useEffect(() => {
    const roomExists = roomId
      ? rooms.some((room) => room.id === roomId)
      : false;

    if (!roomId || !roomExists) {
      setMessages([]);
      return;
    }

    setMessages([]);

    const unsubscribe = subscribeMessages(roomId, (nextMessages) => {
      setMessages(nextMessages);
      setError(null);
    });

    return () => unsubscribe();
  }, [roomId, rooms]);

  async function handleSend(text: string) {
    if (!roomId) {
      return;
    }

    try {
      await sendMessage(roomId, username, text);
      setError(null);
    } catch (sendError) {
      console.error(sendError);
      setError("メッセージの送信に失敗しました。");
    }
  }

  async function handleDeleteRoom(targetRoomId: string) {
    const targetRoom = rooms.find((room) => room.id === targetRoomId);

    if (
      !window.confirm(
        `「${targetRoom?.name ?? "このルーム"}」を削除しますか？\n配下のメッセージもすべて削除されます。`,
      )
    ) {
      return;
    }

    setIsDeletingRoom(true);

    try {
      await deleteRoomApi(targetRoomId);
      setError(null);
    } catch (deleteError) {
      console.error(deleteError);
      setError("ルームの削除に失敗しました。");
    } finally {
      setIsDeletingRoom(false);
    }
  }

  async function handleDeleteMessage(messageId: string) {
    if (!roomId) {
      return;
    }

    const targetMessage = messages.find((message) => message.id === messageId);

    if (
      !window.confirm(
        `このメッセージを削除しますか？\n\n${targetMessage?.username ?? ""}: ${targetMessage?.text ?? ""}`,
      )
    ) {
      return;
    }

    setDeletingMessageId(messageId);

    try {
      await deleteMessageApi(roomId, messageId);
      setError(null);
    } catch (deleteError) {
      console.error(deleteError);
      setError("メッセージの削除に失敗しました。");
    } finally {
      setDeletingMessageId(null);
    }
  }

  async function handleCreateRoom(name: string) {
    setIsCreating(true);

    try {
      const newRoomId = await createRoom(name, user.uid);
      onRoomChange(newRoomId);
      setError(null);
      return newRoomId;
    } finally {
      setIsCreating(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsAuthActionLoading(true);
    setAuthActionError(null);

    try {
      await signInWithGoogle();
    } catch (signInError) {
      console.error(signInError);
      setAuthActionError("Google ログインに失敗しました。");
    } finally {
      setIsAuthActionLoading(false);
    }
  }

  async function handleAdminSignOut() {
    setIsAuthActionLoading(true);
    setAuthActionError(null);

    try {
      await signOutToAnonymous();
    } catch (signOutError) {
      console.error(signOutError);
      setAuthActionError("ログアウトに失敗しました。");
    } finally {
      setIsAuthActionLoading(false);
    }
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-lg flex-col bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div>
          <button
            type="button"
            onClick={handleLogoTap}
            className="text-left"
            aria-label="TestChatApp"
          >
            <h1 className="text-lg font-semibold text-slate-900">TestChatApp</h1>
          </button>
          <p className="text-sm text-slate-500">
            {username} ・ {activeRoom?.name ?? "ルーム未選択"}
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

      {isAdminGateUnlocked ? (
        <AdminAuthPanel
          isAdmin={isAdmin}
          isGoogleSignedIn={googleSignedIn}
          isLoading={isAuthActionLoading}
          error={authActionError}
          onGoogleSignIn={() => void handleGoogleSignIn()}
          onAdminSignOut={() => void handleAdminSignOut()}
        />
      ) : null}

      <RoomSelector
        rooms={rooms}
        activeRoomId={roomId}
        uid={user.uid}
        isCreating={isCreating}
        isDeletingRoom={isDeletingRoom}
        isAdmin={isAdmin}
        onChange={onRoomChange}
        onCreateRoom={handleCreateRoom}
        onDeleteRoom={isAdmin ? handleDeleteRoom : undefined}
      />

      {error ? (
        <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {roomId ? (
        <>
          <MessageList
            messages={messages}
            currentUsername={username}
            isAdmin={isAdmin}
            isDeletingMessageId={deletingMessageId}
            onDeleteMessage={isAdmin ? handleDeleteMessage : undefined}
          />
          <MessageInput onSend={handleSend} />
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center px-4 text-sm text-slate-500">
          ルームを作成するとチャットを開始できます。
        </div>
      )}
    </div>
  );
}
