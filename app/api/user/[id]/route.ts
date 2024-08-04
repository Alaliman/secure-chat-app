import { db } from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await db.user.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) return NextResponse.json({ error: 'No User Found' });

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
  }
}
