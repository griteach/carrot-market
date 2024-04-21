"use server";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import { z } from "zod";

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
      .toLowerCase()
      .trim()
      .refine(checkUsername, "포테이토는 안됩니다. error"),
    email: z.string().email().toLowerCase(),
    password: z.string().min(10).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .refine(checkPassword, {
    message: "패스워드가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });
export async function createAccount(prevState: any, formData: FormData) {
  //formData에 담겨 있는 것을 data 오브젝트에 모두 넣어주고 있다.
  //여기 있는 username, email, password, confirmPassword 등은 Input의 name을 참조하고 있다.
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
