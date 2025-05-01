// app/api/auth/[...nextauth]/route.ts
import prisma from "@/libs/prisma";
import { compare } from "bcrypt";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    // OAuth providers
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // Credentials provider for email/password login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials.username },
                { phone: credentials.username }
              ]
            },
            include: {
              role: {
                select: {
                  name: true,
                  permissions: {
                    select: {
                      name: true
                    }
                  }
                },
              },
            }
          })
          if (!user || !user.password) {
            return null
          }
          const isPasswordValid = await compare(credentials.password, user.password)
          if (!isPasswordValid) {
            return null
          }
          // console.log("🚀 ~ authorize ~ user:", user)
          if (!user.role) {
            // throw new Error("User role not found");
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: '',
              permissions: '',
              organization: user.organization
            }
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role?.name,
            permissions: user.role?.permissions.map((permission) => permission.name),
            organization: user.organization
          }
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Add role to token after sign in
      if (user) {
        // console.log("🚀 ~ jwt ~ user:", user)
        token.role = user.role;
        token.id = user.id;
      }

      // If using OAuth, you can include the access token
      if (account) {
        token.accessToken = account.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      // Add role to session
      if (session.user) {
        // console.log("🚀 ~ session ~ token:", token)
        session.user.role = token.role;
        session.user.id = token.id;
      }

      // Add access token to session
      // session.accessToken = token.accessToken;

      return session;
    },
    async signIn(params) {
      const hasRole = params.user?.role;
      return !!hasRole;
    },
  },
  pages: {
    signIn: '/login',
    error: '/',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
