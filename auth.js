import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./libs/mongo";
import Resend from "@auth/core/providers/resend";

const config = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: "noreply@imran.club",
      name: "email",
    }),
  ],

  adapter: MongoDBAdapter(clientPromise),
};

const handler = NextAuth(config);

export { handler as GET, handler as POST };
export { signIn, signOut } from "next-auth/react";
