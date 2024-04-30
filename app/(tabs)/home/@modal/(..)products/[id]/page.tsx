import ProductModal from "@/components/modal";
import ModalBtn from "@/components/modal-btn";
import db from "@/lib/db";
import { getProductCache } from "@/lib/db_actions";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default async function Modal({ params }: { params: { id: string } }) {
  const product = await getProductCache(Number(params.id));
  return (
    <ProductModal
      description={product?.description!}
      title={product?.title!}
      photo={product?.photo!}
      user={{
        username: product?.user.username!,
        avatar: product?.user.avatar!,
      }}
    />
  );
}
