"use client";
import { BackspaceIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";

export default function Nav() {
  const router = useRouter();
  const onBackClick = () => {
    router.back();
  };
  return (
    <div className="pt-4 pl-5 flex justify-center items-center">
      <div
        onClick={onBackClick}
        className="absolute left-6 top-4 cursor-pointer"
      >
        <BackspaceIcon className="size-8" />{" "}
      </div>
      <div>
        <span className="text-2xl">title</span>
      </div>
    </div>
  );
}
