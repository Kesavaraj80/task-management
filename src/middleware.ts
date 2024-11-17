export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/((?!api|signup|_next/static|_next/image|.*\\.png$).*)"],
};
