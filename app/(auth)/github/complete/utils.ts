import db from "@/lib/db";
import loginSession from "@/lib/login";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

interface GithubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string;
}

export async function getAccessToken(request: NextRequest) {
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
  return access_token;
}

//userProfile에 접근
export async function getUserProfile(accessToken: string) {
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-cache",
  });
  return await userProfileResponse.json();
}

export async function getEmails(accessToken: string) {
  const githubEmails = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-cache",
  });
  const result: GithubEmail[] = await githubEmails.json();
  return result;
}
