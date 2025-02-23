import NextAuth, { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    token: string;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
    };
    token: string;
  }
}

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password");
        }
        try {
          const response = await fetch(
            `${process.env.APP_URL}/api/users/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credentials),
            }
          );
          const data = await response.json();
          if (response.ok && data.data) {
            return {
              id: data.data.user.id,
              name: data.data.user.name,
              email: credentials.email,
              token: data.data.token,
            };
          } else {
            throw new Error(data.message || "Something went wrong!");
          }
        } catch (error: any) {
          console.error("Authorization error:", error.message);
          throw new Error(error.message);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const { email, name } = profile!;
        try {
          const response = await fetch(
            `${process.env.APP_URL}/api/users/google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, name }),
            }
          );
          const data = await response.json();
          if (response.ok && data.data) {
            user.id = data.data.user.id;
            user.name = data.data.user.name;
            user.email = data.data.user.email;
            user.token = data.data.token;
            return true;
          } else {
            console.error("Google sign-in error:", data.message);
            return false;
          }
        } catch (error: any) {
          console.error("Google sign-in error:", error.message);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        token.token = user.token;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name ?? "",
          email: token.email,
        };
        session.token = token.token;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development", // Enable debugging in development
});

export { handler as GET, handler as POST };
