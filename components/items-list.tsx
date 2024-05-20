import { formatToTimeAgo, formatToWon } from "@/lib/utils";

import Image from "next/image";
import Link from "next/link";

interface ListProductsProps {
  id: number;
  created_at: Date;
  updated_at: Date;
  title: string;
  price: number;
  description: string;
  photo: string;
  userId: number;
  status: string;
}

export default function ItemsList({
  title,
  price,
  created_at,
  photo,
  id,
  status,
}: ListProductsProps) {
  return (
    <Link
      href={`/products/${id}`}
      className="grid grid-cols-6 gap-2 last:mb-36"
    >
      <div className="relative  rounded-md overflow-hidden">
        <Image
          fill
          sizes="100"
          src={`${photo}/witdh=100,height=100`}
          alt={title}
          className="object-cover"
          priority
        />
      </div>
      <div className="col-span-5 flex items-center justify-between px-4 py-1   *:text-white">
        <div className="flex flex-col gap-1">
          <span className="text-lg ">{title}</span>
          <span className="text-sm text-neutral-500">
            {formatToTimeAgo(created_at.toString())}
          </span>
          <span className="text-lg font-semibold">{formatToWon(price)}원</span>
        </div>
        {status === "forsale" ? null : status === "reservation" ? (
          <div className="bg-slate-700 rounded-lg px-3 py-1">예약중 </div>
        ) : (
          <div className="bg-slate-700 rounded-lg px-3 py-1">판매완료 </div>
        )}
      </div>
    </Link>
  );
}
