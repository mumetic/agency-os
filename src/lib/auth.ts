import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL!;

interface DirectusUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  role?: {
    id: string;
    name: string;
  };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Login usando fetch directo a Directus
          const loginResponse = await fetch(`${directusUrl}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!loginResponse.ok) {
            console.error('Login failed:', loginResponse.status);
            return null;
          }

          const authData = await loginResponse.json();
          const accessToken = authData.data?.access_token;

          if (!accessToken) {
            console.error('No access token received');
            return null;
          }

          // Obtener datos del usuario
          const userResponse = await fetch(`${directusUrl}/users/me?fields=*,role.name,role.id`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!userResponse.ok) {
            console.error('Failed to get user data');
            return null;
          }

          const userData = await userResponse.json();
          const user: DirectusUser = userData.data;

          return {
            id: user.id,
            email: user.email,
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
            image: user.avatar ? `${directusUrl}/assets/${user.avatar}` : null,
            role: user.role?.name || null,
            accessToken: accessToken,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});