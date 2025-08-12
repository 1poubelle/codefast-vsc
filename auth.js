import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./libs/mango";
import Resend from "next-auth/providers/resend";

const config = {
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: "noreply@imran.club",
      name: "email",
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
};
export const { handlers, signIn, signOut, auth } = NextAuth(config);
