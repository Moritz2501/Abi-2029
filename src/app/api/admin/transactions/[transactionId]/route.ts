import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    // Only KASSE, ADMIN, ROOT can approve
    if (
      session.user.role !== 'KASSE' &&
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'ROOT'
    ) {
      return NextResponse.json(
        { message: 'Keine Berechtigung' },
        { status: 403 }
      );
    }

    const { transactionId } = params;
    const { action } = await request.json();

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      return NextResponse.json(
        { message: 'Transaktion nicht gefunden' },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      // Check if already approved
      const existing = await prisma.approval.findFirst({
        where: {
          transactionId,
          userId: session.user.id as string,
        },
      });

      if (!existing) {
        await prisma.approval.create({
          data: {
            transactionId,
            userId: session.user.id as string,
          },
        });
      }

      // Update transaction status if enough approvals (simplified: 1 approval is enough for now)
      const approvalCount = await prisma.approval.count({
        where: { transactionId },
      });

      if (approvalCount >= 1) {
        await prisma.transaction.update({
          where: { id: transactionId },
          data: { status: 'APPROVED' },
        });
      }
    } else if (action === 'reject') {
      await prisma.transaction.update({
        where: { id: transactionId },
        data: { status: 'REJECTED' },
      });
    }

    return NextResponse.json(
      { message: 'Aktion erfolgreich' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Approve transaction error:', error);
    return NextResponse.json(
      { message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
