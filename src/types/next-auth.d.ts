import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    login: string;
    backendToken: string;
    backendExp: number;
  }

  interface Session {
    error?: string;
    user: {
      id: string;
      login: string;
      backendToken: string;
      backendExp: number;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    login: string;
    backendToken: string;
    backendExp: number;
    error?: string;
  }
}