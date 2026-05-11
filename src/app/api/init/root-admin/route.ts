import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const rootAdminEmail = process.env.ROOT_ADMIN_EMAIL;

    if (!rootAdminEmail) {
      return NextResponse.json(
        { message: 'ROOT_ADMIN_EMAIL nicht konfiguriert' },
        { status: 400 }
      );
    }

    // Check if root admin already exists
    const existingRootAdmin = await prisma.user.findUnique({
      where: { email: rootAdminEmail },
    });

    if (existingRootAdmin) {
      return NextResponse.json(
        { message: 'Root-Admin existiert bereits', user: existingRootAdmin },
        { status: 200 }
      );
    }

    // Create root admin with temporary password
    const tempPassword = Math.random().toString(36).slice(-12);
    const hashedPassword = await hashPassword(tempPassword);

    const rootAdmin = await prisma.user.create({
      data: {
        email: rootAdminEmail,
        password: hashedPassword,
        firstName: 'Root',
        lastName: 'Admin',
        username: 'ROOT',
        role: 'ROOT',
        onboardingStatus: 'APPROVED',
      },
    });

    return NextResponse.json(
      { 
        message: 'Root-Admin erstellt',
        user: rootAdmin,
        tempPassword: tempPassword,
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
