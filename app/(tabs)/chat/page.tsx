import { formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { countUnreadMessages, getAllChatRoomCache } from "./actions";
import { revalidateTag } from "next/cache";
import { useEffect } from "react";

//모든 채팅방 가져오기

export default async function Chat() {
  const rooms = await getAllChatRoomCache();

  const unReadCount = await countUnreadMessages();

  revalidateTag("chatRoom-all");

  return (
    <div className="py-12 px-4 flex flex-col h-screen justify-start items-center ">
      {rooms.map((room) => (
        <Link
          key={room.id}
          href={`/chats/${room.id}`}
          className="cursor-pointer w-full"
        >
          <div className="px-3 py-2 w-full flex justify-center items-center rounded-xl">
            <div className="flex justify-between w-full py-4 px-4 rounded-xl bg-base-100 shadow-xl">
              <div className="flex justify-center items-center gap-4">
                <div>
                  <Image
                    src={`${room.product.photo}/public`}
                    width={50}
                    height={50}
                    alt={room.product.title}
                  />
                </div>
                <div className=" flex flex-col gap-1">
                  <div className="flex gap-3 py-1 pl-1 ">
                    {room.users[0]?.avatar ? (
                      <Image
                        src={`${room.users[0].avatar}`}
                        alt={room.users[0].username}
                        width={30}
                        height={30}
                      />
                    ) : (
                      <div className="size-8 rounded-full bg-slate-400"></div>
                    )}
                    <span className="text-xl text-white">
                      {room.users[0].username}
                    </span>
                  </div>
                  <div className="text-teal-500 text-sm">
                    {room.messages[0]?.payload ?? null}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 ">
                <span className="text-white">
                  {formatToTimeAgo(room.messages[0]?.created_at.toString())}
                </span>
                {unReadCount == 0 ? null : (
                  <div className="badge bg-orange-400 text-white">{`+${unReadCount}`}</div>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
