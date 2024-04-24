"use server";

import db from "@/lib/db";

export async function getMoreProducts(page: number) {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    //하나만 가져오기 (1개겠지? 숫자에 따라서 가져옴)
    skip: page * 1,
    take: 1,
    //건너뛰기 (1개겠지? 숫자에 따라서 건너뜀)
    //오름차순, 내림차순 정렬 적용하기
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}
