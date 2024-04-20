"use server";

import { z } from "zod";

//정규식 표현
const passwordRegex = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
);

function checkUsername(username: string) {
  return !username.includes("potato");
}
function checkPassword({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) {
  return password === confirmPassword;
}

//유효성 검사 하고 싶은 내용을 일단 설명해 놓자. 설계도 같은거지
//청사진 같은거
const usernameSchema = z.string().min(5).max(10);
//아래와 같이 필요한 스키마를 한 번에 생성할 수 있다.
const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "사용자의 이름은 숫자로 구성할 수 없습니다.",
        required_error: "Where is my username?",
      })
      .min(3, "Way too short!!!")
      .max(10, "That is too loooong!")
      .toLowerCase()
      .trim()
      .refine(checkUsername, "포테이토는 안됩니다. error"),
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(10)
      .regex(
        passwordRegex,
        "A password must have lowercase, UPPERCASE, a number and special characters."
      ),
    confirmPassword: z.string().min(10),
  })
  .refine(checkPassword, {
    message: "패스워드가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });
export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
