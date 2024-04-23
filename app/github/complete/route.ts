import db from "@/lib/db";
import loginSession from "@/lib/login";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRETS!,
    code,
  }).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const { error, access_token } = await accessTokenResponse.json();
  if (error) {
    return new Response(null, {
      status: 400,
    });
  }
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });
  const { id, avatar_url, login } = await userProfileResponse.json();
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
    },
    select: {
      id: true,
    },
  });
  await loginSession(newUser.id);
  return redirect("/profile");
}
