import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { generateUsername, hashPassword } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    const { firstName, lastName, password } = await request.json();

    if (!firstName || !lastName || !password) {
      return NextResponse.json(
        { message: 'Alle Felder sind erforderlich' },
        { status: 400 }
      );
    }

    const username = generateUsername(firstName, lastName);
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.update({
      where: { id: session.user.id as string },
      data: {
        firstName,
        lastName,
        username,
        password: hashedPassword,
        onboardingStatus: 'PENDING', // Admin must approve
      },
    });

    return NextResponse.json(
      { message: 'Profil erfolgreich vervollständigt', user },
      { status: 200 }
    );
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
