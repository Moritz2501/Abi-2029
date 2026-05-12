import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Benutzername', type: 'text' },
        password: { label: 'Passwort', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Benutzername und Passwort erforderlich');
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user || !user.password) {
          throw new Error('Benutzername existiert nicht');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Ungültiges Passwort');
        }

        if (user.onboardingStatus !== 'APPROVED') {
          if (user.onboardingStatus === 'PENDING') {
            throw new Error('Dein Account wurde noch nicht freigeschaltet');
          }
          throw new Error('Dein Account wurde abgelehnt');
        }

        return {
          id: user.id,
          name: user.name || user.username || undefined,
          username: user.username || undefined,
          role: user.role,
          onboardingStatus: user.onboardingStatus,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.role = user.role;
        token.onboardingStatus = user.onboardingStatus;
      }

      // Get fresh user data
      const dbUser = await prisma.user.findUnique({
        where: { id: token.id as string },
      });

      if (dbUser) {
        token.role = dbUser.role;
        token.onboardingStatus = dbUser.onboardingStatus;
        token.username = dbUser.username;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.name = session.user.name || token.username as string;
        session.user.role = token.role as any;
        session.user.onboardingStatus = token.onboardingStatus as any;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
