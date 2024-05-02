"use client";
import { useFormStatus } from "react-dom";

export default function CommentButton() {
  const { pending, action, data, method } = useFormStatus();
  return (
    <button disabled={pending} name="comment-btn" className="bg-orange-400 ">
      {pending ? (
        <span className="loading loading-bars loading-sm"></span>
      ) : (
        "등록"
      )}
    </button>
  );
}
