import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password");
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (credentials.email === adminEmail && credentials.password === adminPassword) {
          return { id: "1", name: "Admin", email: adminEmail };
        }

        throw new Error("Invalid email or password");
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectToDatabase();
      const adminEmail = process.env.ADMIN_EMAIL;

      if (account?.provider === "google") {
        // Find if user already exists
        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          // Create new user if they don't exist
          dbUser = await User.create({
            name: user.name || profile?.name || "Unknown User",
            email: user.email,
            image: user.image || (profile as any)?.picture || "",
            role: user.email === adminEmail ? "admin" : "user",
          });
        }

        // Attach role and id to the user object so it gets passed to jwt callback
        (user as any).role = dbUser.role;
        (user as any).id = dbUser._id.toString();
        return true;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      if (user) {
        token.role = (user as any).role || "admin"; // Credentials login defaults to admin
        token.id = (user as any).id || "1";
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
