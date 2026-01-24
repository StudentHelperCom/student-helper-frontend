import nextAuth, {User, Session, NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {login} from "@src/services/login";
import {AxiosError} from "axios";
import {JWT} from "next-auth/jwt";
import {jwtDecode} from "jwt-decode";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        login: { label: "Login", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        try {
          const response = await login.trySignIn({
            login: credentials.login,
            password: credentials.password,
          })

          if (response?.idu) {
            const decoded = jwtDecode(response.idu);

            return {
              id: String(response.idu),
              login: credentials.login,
              backendToken: response.idu,
              backendExp: ((decoded.exp || 0) * 1000),
            };
          }

          return null;
        } catch (err) {
          if (err instanceof AxiosError) {
            console.error(err);
          }
          return null;
        }
      }
    }),
  ],

  pages: {
    signIn: '/auth'
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if(user) {
        token.id = user.id;
        token.login = user.login;
        token.backendToken = user.backendToken;
        token.backendExp = user.backendExp;
      }

      if (token.backendExp && Date.now() > token.backendExp) {
        return { ...token, error: "AccessTokenError" };
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if(session.user) {
        session.user.id = token.id as string;
        session.user.login = token.login as string;
        session.user.backendToken = token.backendToken as string;
      }

      if (token.error) {
        session.error = token.error;
      }

      return session;
    }
  }
};

const handler = nextAuth(authOptions);

export { handler as GET, handler as POST };