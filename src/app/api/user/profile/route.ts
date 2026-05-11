import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    const { firstName, lastName } = await request.json();

    if (!firstName || !lastName) {
      return NextResponse.json(
        { message: 'Vor- und Nachname erforderlich' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: session.user.id as string },
      data: {
        firstName,
        lastName,
      },
    });

    return NextResponse.json(
      { message: 'Profil erfolgreich aktualisiert', user },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
