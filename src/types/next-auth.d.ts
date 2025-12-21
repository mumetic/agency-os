import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name?: string;
    image?: string | null;
    role?: string | null;
    accessToken?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string | null;
      role?: string;
    };
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    accessToken?: string;
  }
}