import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-utils';

export async function POST() {
  try {
    const rootAdminUsername = process.env.ROOT_ADMIN_USERNAME || 'ROOT';

    // Check if root admin already exists
    const existingRootAdmin = await prisma.user.findUnique({
      where: { username: rootAdminUsername },
    });

    if (existingRootAdmin) {
      return NextResponse.json(
        { message: 'Root-Admin existiert bereits', user: existingRootAdmin },
        { status: 200 }
      );
    }

    const tempPassword = Math.random().toString(36).slice(-12);
    const hashedPassword = await hashPassword(tempPassword);

    const rootAdmin = await prisma.user.create({
      data: {
        username: rootAdminUsername,
        password: hashedPassword,
        firstName: 'Root',
        lastName: 'Admin',
        name: 'Root Admin',
        role: 'ROOT',
        onboardingStatus: 'APPROVED',
      },
    });

    return NextResponse.json(
      {
        message: 'Root-Admin erstellt',
        user: rootAdmin,
        tempPassword,
        warning: 'Sichern Sie das temporäre Passwort!',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Init root admin error:', error);
    return NextResponse.json(
      { message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
