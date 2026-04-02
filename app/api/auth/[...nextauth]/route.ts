import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

type CredentialsInput = Record<"email" | "password", string> | undefined;
type UserWithId = { id?: string };

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials: CredentialsInput) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const { email, password } = credentials;
        await connectDB();
        const user = await User.findOne({ email });
        if (!user) throw new Error("No user");
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error("Invalid credentials");
        return { id: user._id.toString(), email: user.email, name: user.name };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const userId = user ? (user as UserWithId).id : undefined;
      if (userId) {
        token.sub = String(userId);
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.sub!;
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
