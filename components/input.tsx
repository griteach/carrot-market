import { InputHTMLAttributes } from "react";

interface InputProps {
  //아래의 속성들은 InputHTMLAttributes를 추가로 받아오기 때문에 굳이 더 적지 않아도 된다.
  //만약 InputHTMLAttributes를 받아오지 않았다면, 적어줘야했겠지

  // type: string;
  // placeholder: string;
  // required: boolean;
  name: string;
  errors?: string[];
}

export default function Input({
  name,
  errors = [],
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <input
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400 transition"
        name={name}
        {...rest}
      />

      {errors.map((error, index) => (
        <span key={index} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}
