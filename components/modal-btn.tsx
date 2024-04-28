"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function ModalBtn() {
  const router = useRouter();
  const onModalBtnClick = () => {
    router.back();
  };
  return (
    <button
      onClick={onModalBtnClick}
      className="absolute right-20 top-20 text-neutral-200"
    >
      <XMarkIcon className="size-10" />
    </button>
  );
}
