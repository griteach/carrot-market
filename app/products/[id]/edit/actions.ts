"use server";

import { productSchema } from "@/app/(tabs)/home/add/schema";
import db from "@/lib/db";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProduct(_: any, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };
  const id = Number(formData.get("productId"));
  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const update = await db.product.update({
      where: {
        id,
      },
      data: {
        title: result.data.title,
        description: result.data.description,
        price: result.data.price,
        photo: result.data.photo,
      },
    });
    if (update) {
      //revaildate home page after update
      revalidateTag("home-products");

      //revaildate product detail page after update
      revalidateTag("product-detail");
      redirect(`/products/${id}`);
    }
  }
}
