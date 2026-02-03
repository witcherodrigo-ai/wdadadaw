import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/zod";
import bcrypt from "bcryptjs";
import { rateLimit } from "@/lib/rate-limit";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const limit = rateLimit(`login:${parsed.data.email}`, 5, 60_000);
        if (!limit.allowed) return null;
        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email }
        });
        if (!user) return null;
        const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!isValid) return null;
        return { id: user.id, email: user.email, role: user.role };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/admin/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    }
  }
};
