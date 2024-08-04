import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    username: string;
    role: string;
    id: string;
  }
  interface Session {
    user: User & {
      username: string;
    };
    username: string;
    token: {
      username: string;
    };
  }
}
