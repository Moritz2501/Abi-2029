import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    onboardingStatus: string;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role: string;
      onboardingStatus: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    onboardingStatus: string;
  }
}
