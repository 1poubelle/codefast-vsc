// /auth.js
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./libs/mongo";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


export const authOptions = {
  providers: [
    EmailProvider({
      server: {
        host: "smtp.resend.com",
        port: 587,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY,
        },
      },
      from: "noreply@resend.imran.club",
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        try {
          await resend.emails.send({
            from: provider.from,
            to: identifier,
            subject: 'Sign in to CodeFast SaaS',
            html: `
              <div>
                <h1>Sign in to CodeFast SaaS</h1>
                <p>Click the link below to sign in:</p>
                <a href="${url}">Sign in</a>
                <p>If you didn't request this email, you can safely ignore it.</p>
              </div>
            `,
          });
        } catch (error) {
          console.error('Error sending email:', error);
          throw new Error('Failed to send verification email');
        }
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // <-- ajouté
};

