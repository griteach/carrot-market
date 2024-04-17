"use client";
import { useFormStatus } from "react-dom";

interface FormButtonProps {
  text: string;
}

export default function FormButton({ text }: FormButtonProps) {
  //useFormStatus는 자신의 부모 요소를 찾으려고 한다.
  //자식 요소에서 사용하는 hook이다.
  //따라서 FormButton을 가지고 있는 부모의 요소에서 action의 진행과정을 가져올 수 있다.
  //지금의 경우에는 login page.tsx가 부모가 되겠지.
  const { pending, action, data, method } = useFormStatus();

  return (
    <>
      <button
        disabled={pending}
        className="primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
      >
        {pending ? "로딩중" : text}
      </button>
    </>
  );
}
