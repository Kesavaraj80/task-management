import React from "react";
import { Button } from "./ui/button";
import { signIn, useSession, signOut } from "next-auth/react";

const Dummy = () => {
  const { data } = useSession();
  console.log(data);

  return (
    <div>
      {data === null && (
        <Button onClick={() => signIn("google")}>SignIn</Button>
      )}
      {data !== null && <Button onClick={() => signOut()}>SignOut</Button>}
    </div>
  );
};

export default Dummy;
