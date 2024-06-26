"use server";

import db from "@/lib/db";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
export async function getMoreProducts(page: number) {
  const products = await db.product.findMany({
    include: {
      buyer: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    //하나만 가져오기 (1개겠지? 숫자에 따라서 가져옴)

    //건너뛰기 (1개겠지? 숫자에 따라서 건너뜀)
    //오름차순, 내림차순 정렬 적용하기
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export const getAllProductCache = nextCache(getMoreProducts, ["product-all"], {
  tags: ["product-all"],
});
