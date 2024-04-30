"use client";

import Image from "next/image";
import ModalBtn from "./modal-btn";
import { PhotoIcon } from "@heroicons/react/24/solid";

interface ModalProps {
  title: string;
  description: string;
  photo: string;
  user: {
    username: string;
    avatar: string | null;
  };
}

export default function ProductModal({
  photo,
  title,
  description,
  user: { username, avatar },
}: ModalProps) {
  const onModalPhotoClick = () => {
    window.location.reload();
  };

  return (
    <div className="absolute w-full  h-full z-50 flex flex-col justify-center items-center bg-black bg-opacity-60 left-0 top-0 cursor-pointer">
      <ModalBtn />
      <div
        onClick={onModalPhotoClick}
        className="max-w-screen-sm h-1/2 flex justify-center w-full  relative"
      >
        {photo ? (
          <Image
            fill
            src={`${photo}/public`}
            alt={title}
            className="object-cover"
          />
        ) : (
          <div className="aspect-square bg-neutral-700 rounded-md text-neutral-200 flex justify-center items-center">
            <PhotoIcon className="h-28" />
          </div>
        )}
      </div>
      <div className="max-w-screen-sm flex flex-col w-full pt-8 pl-8 gap-2">
        <span className="font-bold text-3xl">{title}</span>
        <span className="text-xl">{description}</span>

        <div>
          {avatar ? (
            <Image width={40} height={40} src={avatar} alt={username} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
