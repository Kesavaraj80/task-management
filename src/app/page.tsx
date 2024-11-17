"use client";

// import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  // const { data } = useSession();

  // console.log("home comp", data);

  // if (data === undefined) {
  //   redirect("/login");
  // }

  redirect("/task");

  // return (
  //   <main>
  //     <Dummy />
  //   </main>
  // );
}
