import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const published = searchParams.get('published') === 'true';

    const pages = await prisma.page.findMany({
      where: published ? { published: true } : undefined,
      include: {
        creator: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(pages, { status: 200 });
  } catch (error) {
    console.error('Pages error:', error);
    return NextResponse.json(
      { message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, slug, content } = await request.json();

    if (!title || !slug || !content) {
      return NextResponse.json(
        { message: 'Alle Felder erforderlich' },
        { status: 400 }
      );
    }

    // Get current user (simplified - you'd use getServerSession)
    const page = await prisma.page.create({
      data: {
        title,
        slug,
        content,
        published: false,
        createdBy: 'TEMP_USER_ID', // Should be replaced with actual user ID
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Create page error:', error);
    return NextResponse.json(
      { message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
