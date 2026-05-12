import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateUniqueUsername } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, password } = await request.json();

    if (!firstName || !lastName || !password) {
      return NextResponse.json(
        { message: 'Vorname, Nachname und Passwort erforderlich' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Das Passwort muss mindestens 8 Zeichen lang sein' },
        { status: 400 }
      );
    }

    const username = await generateUniqueUsername(firstName, lastName);
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        name: `${firstName} ${lastName}`,
        password: hashedPassword,
        role: 'USER',
        onboardingStatus: 'PENDING',
      },
    });

    return NextResponse.json(
      {
        message: 'Registrierung erfolgreich',
        userId: user.id,
        username: user.username,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
