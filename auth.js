// /auth.js
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./libs/mongo";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


/** @type {import('next-auth').NextAuthOptions} */
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
      if (token && session?.user?.email) {
        try {
          const { default: connectMongo } = await import('./libs/mongoose');
          const { default: User } = await import('./models/Users');
          
          // Ensure connection is fully established before querying
          console.log('Establishing connection for session callback');
          await connectMongo();
          
          // Add small delay to ensure connection is ready in serverless environment
          await new Promise(resolve => setTimeout(resolve, 100));
          
          console.log('Querying user for session:', session.user.email);
          const customUser = await User.findOne({ email: session.user.email });
          
          if (customUser) {
            session.user.id = customUser._id.toString();
            console.log('Found custom user:', customUser._id);
          } else {
            session.user.id = token.sub;
            console.log('Using token sub as user ID:', token.sub);
          }
        } catch (error) {
          console.error('Error in session callback:', error);
          // Fallback to token sub if database query fails
          session.user.id = token.sub;
        }
      }
      return session;
    },
    async signIn({ user, account }) {
      // Ensure user exists in our custom User model
      if (account?.provider === 'email') {
        try {
          const { default: connectMongo } = await import('./libs/mongoose');
          const { default: User } = await import('./models/Users');
          
          await connectMongo();
          
          // Check if user exists in our custom model
          let customUser = await User.findOne({ email: user.email });
          
          if (!customUser) {
            // Create user in our custom model
            customUser = await User.create({
              email: user.email,
              name: user.name || '',
              image: user.image || '',
              boards: []
            });
            console.log('Created custom user:', customUser._id);
          }
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // <-- ajouté
};

