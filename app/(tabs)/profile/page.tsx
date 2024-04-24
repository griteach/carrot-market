import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        username: true,
        email: true,
      },
    });
    return user;
  }
  //session이 없을때 not-found
  notFound();
}

export default async function Profile() {
  const user = await getUser();

  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };

  return (
    <div>
      <h1>
        Welcome! {user?.username}, {user?.email}
      </h1>
      <form action={logOut}>
        <button className="bg-red-500 p-3 rounded-xl font-bold">Log Out</button>
      </form>
    </div>
  );
}
