import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        const existingUser = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!existingUser || !existingUser.password) {
          return null;
        }
        const isPasswordValid = await compare(
          credentials.password as string,
          existingUser.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
        };
      },
    }),
  ],

  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      if (pathname.startsWith("/login") && isLoggedIn) {
        return Response.redirect(new URL("/task", nextUrl));
      }

      if (pathname.startsWith("/signup") && isLoggedIn) {
        return Response.redirect(new URL("/task", nextUrl));
      }

      if (pathname.startsWith("/task") && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }
      return !!auth;
    },

    async signIn({ user, account }) {
      if (account && account.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email as string },
        });

        if (!existingUser) {
          return `/signup?name=${user.name}&email=${user.email}`;
        }

        return true;
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
});
