import NextAuth from "next-auth";
import Resend from "@auth/core/providers/resend";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./libs/mongo";

export const config = {
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: "noreply@resend.imran.club",
      name: "email",
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
};

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth(config);
