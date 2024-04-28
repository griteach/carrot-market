import ModalBtn from "@/components/modal-btn";
import db from "@/lib/db";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

export default async function Modal({ params }: { params: { id: string } }) {
  const product = await db.product.findUnique({
    where: {
      id: Number(params.id),
    },
    select: {
      title: true,
      description: true,
      photo: true,
      // user: {
      //   select: {
      //     avatar: true,
      //   },
      // },
    },
  });
  return (
    <div className="absolute w-full h-full z-50 flex flex-col justify-center items-center bg-black bg-opacity-60 left-0 top-0">
      <ModalBtn />
      <div className="max-w-screen-sm h-1/2 flex justify-center w-full bg-red-400 relative">
        {product?.photo ? (
          <Image
            fill
            src={`${product.photo}/public`}
            alt={product.title}
            className="object-cover"
          />
        ) : (
          <div className="aspect-square bg-neutral-700 rounded-md text-neutral-200 flex justify-center items-center">
            <PhotoIcon className="h-28" />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full pt-8 pl-8 gap-2">
        <span className="font-bold text-3xl">{product?.title}</span>
        <span className="text-xl">{product?.description}</span>
      </div>
    </div>
  );
}
