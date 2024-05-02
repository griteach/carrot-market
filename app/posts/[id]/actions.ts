"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { connect } from "http2";
import { revalidateTag } from "next/cache";
import { commentSchema } from "./commentSchema";

export const likePost = async (postId: number) => {
  try {
    const session = await getSession();
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
};
export const dislikePost = async (postId: number) => {
  try {
    const session = await getSession();
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
};

export const uploadComment = async (_: any, formData: FormData) => {
  const data = {
    payload: formData.get("comment"),
    postId: formData.get("postId"),
  };
  const result = commentSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    try {
      const session = await getSession();
      const { id, created_at, payload, postId, updated_at, userId } =
        await db.comment.create({
          data: {
            payload: result.data.payload,
            post: {
              connect: {
                id: Number(result.data.postId),
              },
            },
            user: {
              connect: {
                id: session.id,
              },
            },
          },
        });
      //여기서 revaildateTag
      revalidateTag("post-detail");
      return { id, created_at, payload, postId, updated_at, userId };
    } catch (e) {}
  }
};
