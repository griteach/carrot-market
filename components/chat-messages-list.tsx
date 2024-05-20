"use client";
import {
  saveMessage,
  setConfirm,
  setReservation,
} from "@/app/chats/[id]/actions";
import { InitialChatMessages } from "@/app/chats/[id]/actions";
import { supabase } from "@/lib/\bsupabaseClient";
import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import CreateReview from "./createReview";

interface ChatMessageListProps {
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
  avatar: string;
  username: string;
  status: string;
  productId: number;
}

export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
  avatar,
  username,
  status,
  productId,
}: ChatMessageListProps) {
  const [currentReservation, setCurrentReservation] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null); // 채팅 리스트 끝부분을 참조할 ref
  const inputRef = useRef<HTMLInputElement>(null); // 입력창을 참조할 ref
  // 메시지 목록의 끝으로 스크롤하는 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [dday, setDday] = useState(0);
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const channel = useRef<RealtimeChannel>();

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setMessage(value);
  };
  const onInputSubmit = async (event: React.FormEvent) => {
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
        isRead: false,
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
        isRead: false,
        user: {
          username,
          avatar,
        },
      },
    });
    await saveMessage(message, chatRoomId);
    setMessage("");
    setTimeout(scrollToBottom, 1000);
  };
  useEffect(() => {
    //useState 현재 예약현황 저장
    setCurrentReservation(status);

    //supabase connect

    channel.current = supabase.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prev) => [...prev, payload.payload]);
      })
      .subscribe();

    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId, status]);

  useEffect(scrollToBottom, [messages]);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const interceptionReservation = (_: any, formData: FormData) => {
    formData.set("chatId", chatRoomId);

    if (currentReservation === "forsale") {
      formData.set("status", "reservation");
      setCurrentReservation("reservation");
    } else {
      formData.set("status", "forsale");
      setCurrentReservation("forsale");
    }

    return setReservation(_, formData);
  };

  const interceptionConfirm = (_: any, formData: FormData) => {
    formData.set("chatId", chatRoomId);

    formData.set("status", "sold");
    setCurrentReservation("sold");

    return setConfirm(_, formData);
  };

  const [state, action] = useFormState(interceptionReservation, null);
  const [stateConfirm, actionConfirm] = useFormState(interceptionConfirm, null);

  return (
    <div>
      <div className="p-5 flex flex-col gap-5 min-h-screen justify-end ">
        <div className="fixed inset-x-0 z-10 top-10 flex justify-center items-start px-10">
          <div className="w-full px-6 py-2 bg-slate-200 rounded-md flex justify-between items-center gap-8  ">
            <div className="flex flex-col text-black  grow text-center">
              {currentReservation === "forsale" ? (
                <div>
                  griteach님과 거래 예약을 원하시면 예약하기 버튼을 눌러주세요.
                </div>
              ) : currentReservation === "reservation" ? (
                <div>
                  griteach님과 거래를 완료하시려면 구매확정 버튼을 눌러주세요.
                </div>
              ) : null}
              {currentReservation === "reservation" ? (
                <div>구매확정까지 7일 남았습니다.</div>
              ) : currentReservation === "sold" ? (
                "구매가 완료되었습니다."
              ) : null}
            </div>
            {currentReservation === "forsale" ? (
              <form action={action}>
                <button className="bg-red-500  text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">
                  예약하기
                </button>
              </form>
            ) : currentReservation === "reservation" ? (
              <form action={action}>
                <button className="bg-red-500  text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">
                  예약취소
                </button>
              </form>
            ) : null}

            {currentReservation === "reservation" ? (
              <form action={actionConfirm}>
                <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">
                  구매확정
                </button>
              </form>
            ) : currentReservation === "sold" ? (
              <div className="bg-gray-500 text-white py-2 px-4 rounded-lg cursor-not-allowed  whitespace-nowrap">
                구매완료
              </div>
            ) : null}
          </div>
        </div>

        {messages.map((message) => (
          <div key={message.id}>
            {message.userId === userId ? (
              <div className="chat chat-end">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    {message.user.avatar ? (
                      <Image
                        width={30}
                        height={30}
                        src={message.user.avatar}
                        alt={message.user.username}
                      />
                    ) : (
                      <div className="size-10 rounded-full bg-teal-400"></div>
                    )}
                  </div>
                </div>
                <div className="chat-header">
                  {message.user.username}
                  <time className="ml-2 text-xs opacity-50"></time>
                </div>
                <div className="chat-bubble">{message.payload}</div>
                <div className="chat-footer opacity-50"></div>
              </div>
            ) : (
              <div className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    {message.user.avatar ? (
                      <Image
                        width={30}
                        height={30}
                        src={message.user.avatar}
                        alt={message.user.username}
                      />
                    ) : (
                      <div className="size-10 rounded-full bg-teal-400"></div>
                    )}
                  </div>
                </div>
                <div className="chat-header">
                  {message.user.username}
                  <time className="ml-2 text-xs opacity-50"></time>
                </div>
                <div className="chat-bubble">{message.payload}</div>
                <div className="chat-footer opacity-50"></div>
              </div>
            )}
          </div>
        ))}
        <hr />

        {currentReservation === "sold" ? (
          <CreateReview productId={productId} />
        ) : null}
        <div ref={messagesEndRef} />
        {currentReservation === "sold" ? null : (
          <form
            onSubmit={onInputSubmit}
            className=" w-full p-4 flex justify-center gap-4 z-2"
          >
            <input
              type="text"
              placeholder={
                currentReservation === "sold"
                  ? "구매완료 된 품목입니다."
                  : "대화를 입력해 주세요."
              }
              onChange={onInputChange}
              value={message}
              className="text-black w-3/4"
              ref={inputRef}
            />
            <button className="btn btn-active bg-orange-400 text-white">
              보내기
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
