import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const events = await prisma.eventCalendar.findMany({
      where: {
        date: {
          gte: new Date(new Date().getFullYear(), 0, 1),
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Events error:', error);
    return NextResponse.json(
      { message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, date, location } = await request.json();

    if (!title || !date) {
      return NextResponse.json(
        { message: 'Titel und Datum erforderlich' },
        { status: 400 }
      );
    }

    const event = await prisma.eventCalendar.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
