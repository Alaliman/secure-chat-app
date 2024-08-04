import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { db } from '@/lib/prismadb';

export const GET = async (req: Request) => {
  const session = await getServerSession(authOptions);

  return NextResponse.json({ authenticated: !!session });
};
