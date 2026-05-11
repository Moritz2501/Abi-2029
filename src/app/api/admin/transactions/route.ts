import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    // Only KASSE, ADMIN, ROOT can view transactions
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

    const transactions = await prisma.transaction.findMany({
      include: {
        user: {
          select: { email: true, firstName: true, lastName: true },
        },
        approvals: {
          include: {
            user: {
              select: { email: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate total
    const total = transactions.reduce((sum, t) => {
      if (t.type === 'INCOME') return sum + t.amount;
      return sum - t.amount;
    }, 0);

    return NextResponse.json(
      { transactions, total },
      { status: 200 }
    );
  } catch (error) {
    console.error('Transactions error:', error);
    return NextResponse.json(
      { message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    const { type, amount, description } = await request.json();

    if (!type || !amount || !description) {
      return NextResponse.json(
        { message: 'Alle Felder erforderlich' },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount: parseFloat(amount),
        description,
        userId: session.user.id as string,
        status: 'PENDING', // Requires approval
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json(
      { message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
