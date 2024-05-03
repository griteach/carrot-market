import db from "@/lib/db";
import getSession, { getIsOwner } from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import { getProduct, getProductCache, getProductTitle } from "@/lib/db_actions";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    //isNan = is not a number 자바스크립트 함수
    return notFound();
  }
  const product = await getProductCache(id);
  return {
    title: product?.title,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  //url id가 숫자인지 확인. 숫자여야 하기 때문에 숫자가 아닌 경우는 notFound를 리턴하자.
  const id = Number(params.id);
  if (isNaN(id)) {
    //isNan = is not a number 자바스크립트 함수
    return notFound();
  }
  //물품 가져오고
  const product = await getProductCache(id);

  //만약 물품이 없으면 낫파운드.
  if (!product) {
    return notFound();
  }

  const revalidate = async () => {
    "use server";
    revalidateTag("product-title");
    revalidateTag("product-detail");
  };

  const createChatRoom = async () => {
    "use server";

    const session = await getSession();

    const existingRoom = await db.chatRoom.findFirst({
      where: {
        users: {
          every: {
            id: {
              in: [product.userId, session.id!],
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (existingRoom) {
      redirect(`/chats/${existingRoom.id}`);
    } else {
      const room = await db.chatRoom.create({
        data: {
          users: {
            connect: [
              {
                id: product.userId,
              },
              {
                id: session.id,
              },
            ],
          },
          product: {
            connect: {
              id: product.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      redirect(`/chats/${room.id}`);
    }
  };

  //이 물건이 접속한 사용자의 물건인지 확인하기
  //Boolean이니까 필요한 경우 true, false 값으로 조절하자.
  const isOwner = await getIsOwner(product.userId);
  return (
    <div className="p-6">
      <div className="relative aspect-square">
        <Image
          fill
          src={`${product.photo}/witdh=500,height=500`}
          alt={product.title}
          className="object-cover"
        />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="mb-48">ddd</div>
      <div className="fixed w-full bottom-0 left-0 p-5  bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}원
        </span>
        {isOwner ? (
          <form action={revalidate}>
            <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
              Revalidate
            </button>
          </form>
        ) : null}
        {isOwner ? (
          <Link
            href={`/products/${id}/edit`}
            className="bg-green-500 px-5 py-2.5 rounded-md text-white font-semibold"
          >
            edit
          </Link>
        ) : null}
        <form action={createChatRoom}>
          <button className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold">
            채팅하기
          </button>
        </form>
      </div>
    </div>
  );
}
export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: {
      id: true,
    },
  });
  return products.map((product) => ({ id: product.id + "" }));
}
