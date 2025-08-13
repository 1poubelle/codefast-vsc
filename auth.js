import NextAuth from "next-auth";
<<<<<<< HEAD
import Resend from "@auth/core/providers/resend";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./libs/mongo";
=======
import GithubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./libs/mongo";
import Resend from "@auth/core/providers/resend";
>>>>>>> f64569f (ok)

export const config = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
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

<<<<<<< HEAD
export const {
  handlers: { GET, POST },
  auth,
} = NextAuth(config);
=======
const handler = NextAuth(config);

export { handler as GET, handler as POST };
export const auth = handler.auth; // Fixed auth export
>>>>>>> f64569f (ok)
