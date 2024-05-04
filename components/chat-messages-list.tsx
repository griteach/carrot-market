"use client";
import { InitialChatMessages } from "@/app/chats/[id]/page";
import { formatToTimeAgo } from "@/lib/utils";
import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { SyntheticEvent, useEffect, useRef, useState } from "react";

interface ChatMessageListProps {
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
  avatar: string;
  username: string;
}

const SUPABASE_URL = "https://nkyaktziufxaarjfjnoa.supabase.co";
const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5reWFrdHppdWZ4YWFyamZqbm9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ3ODMzMTEsImV4cCI6MjAzMDM1OTMxMX0.WC97hwlePJ8BPkbuh4gT7vkHGG6MkqRcVHIP5-Rub7A";

export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
  avatar,
  username,
}: ChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const channel = useRef<RealtimeChannel>();
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setMessage(value);
  };
  const onInputSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessages((prevMsg) => [
      ...prevMsg,
      {
        id: Date.now(),
        created_at: new Date(),
        payload: message,
        user: {
          avatar,
          username,
        },
        userId: userId,
      },
    ]);
    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username,
          avatar,
        },
      },
    });
    setMessage("");
  };
  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prev) => [...prev, payload.payload]);
      })
      .subscribe();

    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);

  return (
    <div className="p-5 flex flex-col gap-5 min-h-screen justify-end">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2 items-start ${
            message.userId === userId ? "justify-end" : ""
          }`}
        >
          {message.userId === userId ? null : message.user.avatar ? (
            <Image
              width={30}
              height={30}
              src={message.user.avatar}
              alt={message.user.username}
            />
          ) : (
            <div className="size-8 rounded-full bg-teal-400"></div>
          )}
          <div
            className={`flex flex-col gap-1 ${
              message.userId === userId ? "items-end" : ""
            }`}
          >
            <span
              className={`${
                message.userId === userId ? "bg-green-500" : "bg-orange-500"
              } p-2.5 rounded-md `}
            >
              {message.payload}
            </span>
            <span className="text-xs">
              {formatToTimeAgo(message.created_at.toString())}
            </span>
          </div>
        </div>
      ))}
      <form onSubmit={onInputSubmit}>
        <input
          type="text"
          placeholder="대화를 입력해 주세요."
          onChange={onInputChange}
          value={message}
          className="text-black"
        />
        <button>보내기</button>
      </form>
    </div>
  );
}
