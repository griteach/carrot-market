import db from "@/lib/db";
import loginSession from "@/lib/login";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { getAccessToken, getEmails, getUserProfile } from "./utils";

export async function GET(request: NextRequest) {
  const accessTokenResult = await getAccessToken(request);

  const { id, avatar_url, login } = await getUserProfile(accessTokenResult);

  const emailResult = await getEmails(accessTokenResult);

  const user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    },
  });
  if (user) {
    await loginSession(user.id);
    return redirect("/profile");
  }

  const usernameExists = await db.user.findUnique({
    where: {
      username: login,
    },
    select: {
      id: true,
    },
  });
  let modifiedUsername = login;
  if (usernameExists) {
    modifiedUsername = login + String(id);
  }
  const newUser = await db.user.create({
    data: {
      github_id: id + "",
      avatar: avatar_url,
      username: modifiedUsername,
      email: emailResult[0].email,
    },
    select: {
      id: true,
    },
  });
  await loginSession(newUser.id);
  return redirect("/profile");
}
