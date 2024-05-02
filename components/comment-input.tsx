"use client";
import { useFormState } from "react-dom";
import CommentButton from "./comment-button";
import { uploadComment } from "@/app/posts/[id]/actions";
import Input from "./input";
import { Suspense, useOptimistic, useState } from "react";
import Comments from "./comments";
import { formatToTimeAgo } from "@/lib/utils";

interface CommentsProps {
  payload: string;
  id: number;
  created_at: Date;
  userId: number;
  user: {
    username: string;
    avatar: string | null;
  };
}

export default function CommentInput({
  id,
  sessionId,
  comments,
  user,
}: {
  id: number;
  sessionId: number;
  comments: CommentsProps[];
  user: { username: string; avatar: string | null };
}) {
  const [optimisticState, reducerFn] = useOptimistic(
    comments,
    (previousComments, payload: CommentsProps) => [...previousComments, payload]
  );

  //여기서 server action을 intercept해서 필요한 작업 수행
  //formData이용해서 newComment 생성
  const interceptAction = async (_: any, formData: FormData) => {
    //formData 이용해서 newComment 생성
    const newComment = {
      payload: formData.get("comment")?.toString()!,
      id,
      created_at: new Date(),
      userId: sessionId,
      user: {
        username: "optimistic",
        avatar: null,
      },
    };

    //optimistic
    reducerFn(newComment);
    formData.append("postId", id + "");
    return uploadComment(_, formData);
  };

  //useFormState
  const [_, action] = useFormState(interceptAction, null);

  return (
    <div>
      <Suspense fallback={<div>loading...</div>}>
        {optimisticState.map((comment) => (
          <Comments
            key={comment.id}
            id={comment.id}
            payload={comment.payload}
            sessionId={sessionId}
            user={comment.user}
            userId={comment.userId}
            createdAt={formatToTimeAgo(comment.created_at.toString())}
          />
        ))}
      </Suspense>
      <div className="w-4/5 mx-auto mt-6 mb-10">
        <form action={action} className="grid grid-cols-5 gap-2 w-full ">
          <input
            className="col-span-4 text-black"
            type="text"
            name="comment"
            placeholder="댓글을 입력해 주세요."
          />
          <CommentButton />
        </form>
      </div>
    </div>
  );
}
