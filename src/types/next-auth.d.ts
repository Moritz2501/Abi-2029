import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    username?: string;
    onboardingStatus: string;
  }

  interface Session {
    user: {
      id: string;
      username?: string;
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
