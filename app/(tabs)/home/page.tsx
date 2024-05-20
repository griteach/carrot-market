import HomeProductList from "@/components/home-product-list";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { getAllProductCache, getMoreProducts } from "./actions";

export type InitialProducts = Prisma.PromiseReturnType<typeof getMoreProducts>;

export const metadata = {
  title: "Home",
};

export default async function Products() {
  const initialProducts = await getAllProductCache(0);

  return (
    <div>
      <HomeProductList initialProducts={initialProducts} />
      {/* <form action={revalidate}>
        <button>Revalidate</button>
      </form> */}
      <Link
        href="/home/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
