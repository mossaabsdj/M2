import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt", // أخف وأسرع
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash || !user.isActive) return null;

        const isValid = await compare(credentials.password, user.passwordHash);

        if (!isValid) return null;

        // هذا يرجع داخل token
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // أول login
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      // نحقنو role في session
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
