import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    login: string;
    backendToken: string;
  }

  interface Session {
    user: {
      id: string;
      login: string;
      backendToken: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    login: string;
    backendToken: string;
  }
}