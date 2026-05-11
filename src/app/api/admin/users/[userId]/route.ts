import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { canManageUser, isRootAdmin } from '@/lib/auth-utils';

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    const { userId } = params;
    const { action, role, reason } = await request.json();

    const admin = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!admin || !targetUser) {
      return NextResponse.json(
        { message: 'Benutzer nicht gefunden' },
        { status: 404 }
      );
    }

    // Check permissions
    if (
      admin.role !== 'ADMIN' &&
      admin.role !== 'ROOT'
    ) {
      return NextResponse.json(
        { message: 'Keine Berechtigung' },
        { status: 403 }
      );
    }

    // Protect Root-Admins
    if (
      targetUser.role === 'ROOT' &&
      !isRootAdmin(admin.role)
    ) {
      return NextResponse.json(
        { message: 'Root-Admins können nicht von normalen Admins geändert werden' },
        { status: 403 }
      );
    }

    switch (action) {
      case 'approve':
        if (targetUser.onboardingStatus !== 'PENDING') {
          return NextResponse.json(
            { message: 'Benutzer ist nicht in Freigabe-Status' },
            { status: 400 }
          );
        }
        await prisma.user.update({
          where: { id: userId },
          data: { onboardingStatus: 'APPROVED' },
        });
        break;

      case 'reject':
        await prisma.user.update({
          where: { id: userId },
          data: { onboardingStatus: 'REJECTED' },
        });
        if (reason) {
          await prisma.rejection.create({
            data: {
              userId,
              reason,
            },
          });
        }
        break;

      case 'updateRole':
        if (!canManageUser(admin.role, targetUser.role)) {
          return NextResponse.json(
            { message: 'Sie können diese Benutzerrolle nicht ändern' },
            { status: 403 }
          );
        }
        // Root-Admins können only ein anderer Root-Admin aktualisieren
        if (role === 'ROOT' && !isRootAdmin(admin.role)) {
          return NextResponse.json(
            { message: 'Nur Root-Admins können Root-Status vergeben' },
            { status: 403 }
          );
        }
        await prisma.user.update({
          where: { id: userId },
          data: { role },
        });
        break;

      case 'delete':
        // Protect Root-Admins from deletion
        if (targetUser.role === 'ROOT') {
          return NextResponse.json(
            { message: 'Root-Admins können nicht gelöscht werden' },
            { status: 403 }
          );
        }
        await prisma.user.delete({
          where: { id: userId },
        });
        break;

      default:
        return NextResponse.json(
          { message: 'Ungültige Aktion' },
          { status: 400 }
        );
    }

    return NextResponse.json(
      { message: 'Aktion erfolgreich' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin action error:', error);
    return NextResponse.json(
      { message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
