import ChatMessagesList from "@/components/chat-messages-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { markMessageAsRead } from "./actions";

//현재 채팅방 정보 가져오기
async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: {
          id: true,
        },
      },
    },
  });
  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id));
    if (!canSee) {
      return null;
    }
  }
  return room;
}

//user info 가져오기
async function getUserInfo() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      avatar: true,
      username: true,
    },
  });
  return user;
}

//현재 채팅방 메세지 가져오기
async function getMessage(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      payload: true,
      id: true,
      created_at: true,
      userId: true,
      isRead: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return messages;
}

//message 타입 정하기
export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessage>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
  //load room info
  const room = await getRoom(params.id);
  if (!room) {
    return notFound();
  }

  //load user info
  const user = await getUserInfo();
  if (!user) {
    return notFound();
  }

  //메세지 초기값 (현재 서버에 저장되어 있던) 정하기
  const initialMessages = await getMessage(params.id);

  //동시에 안읽은 메세지는 채팅방 들어가면서 동시에 읽음으로 바꾸기
  //이 데이터는 useState에 초기값으로 들어가는 데이터
  //db작업은 다시 해줘야지
  const setReadMessages = initialMessages.map((message) => ({
    ...message,
    isRead: true,
  }));
  const session = await getSession();

  //db에 실제로 isRead:true 작업해주기
  await markMessageAsRead(params.id);

  return (
    <ChatMessagesList
      chatRoomId={params.id}
      userId={session.id!}
      username={user.username}
      avatar={user.avatar!}
      initialMessages={setReadMessages}
    />
  );
}
