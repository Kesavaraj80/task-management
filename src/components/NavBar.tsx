import { auth } from "@/auth";
import { Button } from "./ui/button";
import { handleSignOut } from "@/app/actions/authActions";

const NavBar = async () => {
  const session = await auth();

  if (!session) {
    return null;
  }

  return (
    <nav className="h-full max-h-16 w-full flex justify-between items-center bg-primary shadow-md">
      <div className="ml-10">
        <span className="text-xl text-primary-foreground">Task Management</span>
      </div>
      <form className="mr-5" action={handleSignOut}>
        <Button variant="secondary" type="submit">
          Sign Out
        </Button>
      </form>
    </nav>
  );
};

export default NavBar;
