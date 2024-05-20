import Image from "next/image";
import { formatToWon } from "@/lib/utils";
import { getSalesHistoryProductCache } from "./actions";
import { revalidateTag } from "next/cache";

export default async function SalePage() {
  const products = await getSalesHistoryProductCache();
  revalidateTag("product-saleHistory");
  //일단
  return (
    <div className="p-6 h-screen flex flex-col gap-4 items-center text-black">
      <div className="w-full mx-auto px-5 py-8 bg-white  rounded-lg shadow">
        <h1 className="text-xl font-bold">Sales List</h1>
        <hr />
        <div className="flex flex-col gap-3 mt-4 px-4">
          {products.map((product) => (
            <div key={product.id} className="">
              <div className="grid grid-cols-5 gap-2">
                <div className="relative flex justify-center items-center bg-red-200">
                  <Image
                    fill
                    sizes="100"
                    src={`${product.photo}/witdh=100,height=100`}
                    alt={product.title}
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="flex flex-col col-span-4">
                  <h1>{product.title}</h1>
                  <span>{`${formatToWon(product.price)}원`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
