import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

//해당 물품목록이 현재 접속한 사용자의 것이라면 구매할 수 없겠지
//또는 에디트 버튼이 나와야겠지
//따라서 현재 물품 등록자와 현재 접속한 사람이 같은 사람인지 구분해야한다.
async function getIsOwner(userId: number) {
  //세션을 불러와서 아이디를 꺼낼거야.
  const session = await getSession();
  if (session.id) {
    return session.id === userId; //세션 아이디와 물건의 유저 아이디가 같다면 true
  } else {
    return false; //아니면 당연히 false
  }
}

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    //include를 사용해서 product의 유저를 포함하여 가져오자.
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
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
  const product = await getProduct(id);

  //만약 물품이 없으면 낫파운드.
  if (!product) {
    return notFound();
  }

  //이 물건이 접속한 사용자의 물건인지 확인하기
  //Boolean이니까 필요한 경우 true, false 값으로 조절하자.
  const isOwner = await getIsOwner(product.userId);
  return (
    <div>
      <div className="relative aspect-square">
        <Image
          fill
          src={`${product.photo}/public`}
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
          <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
            Delete product
          </button>
        ) : null}
        <Link
          className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
          href={``}
        >
          채팅하기
        </Link>
      </div>
    </div>
  );
}
