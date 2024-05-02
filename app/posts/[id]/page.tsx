import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";

import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "@/components/like-button";
import Comments from "@/components/comments";
import { Suspense, useOptimistic } from "react";
import CommentInput from "@/components/comment-input";
import CommentButton from "@/components/comment-button";
import Input from "@/components/input";
import { uploadComment } from "./actions";
import { useFormState } from "react-dom";

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        comments: {
          select: {
            id: true,
            payload: true, //comment string
            userId: true, //userid of author
            created_at: true,
            user: {
              select: {
                avatar: true, //avatar of author
                username: true, //username of author
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    console.log("getPost by ID : ", id);
    console.log(post.comments);
    return post;
  } catch (e) {
    return null;
  }
}

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
  revalidate: 60,
});

async function getLikeStatus(postId: number) {
  const session = await getSession();
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: session.id!,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

function getCachedLikeStatus(postId: number) {
  const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId);
}

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const post = await getCachedPost(id);

  if (!post) {
    return notFound();
  }
  const post_user = post.user;
  const post_comments = post.comments;

  const { likeCount, isLiked } = await getCachedLikeStatus(id);

  const session = await getSession();

  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        {post.user.avatar ? (
          <Image
            width={28}
            height={28}
            className="size-7 rounded-full"
            src={post.user.avatar}
            alt={post.user.username}
          />
        ) : (
          <div className="rounded-full bg-teal-500 size-8" />
        )}
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>

        <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
      </div>
      <CommentInput
        id={id}
        sessionId={session.id!}
        comments={post_comments}
        user={post_user}
      />
    </div>
  );
}
