import { db } from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';
import { NextApiRequest } from 'next';

const prisma = db;

export async function GET(
  req: Request,
  { params }: { params: { id: string[] } },
) {
  const slug = params.id;
  const userId = slug[0];

  if (!userId || Array.isArray(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' });
  }

  try {
    const friendsList = await prisma.friend.findMany({
      where: {
        friendIds: {
          has: userId,
        },
      },
      include: {
        friends: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!friendsList)
      return NextResponse.json(
        { error: 'No Friend found for user' },
        { status: 500 },
      );
    // mapping through the friendslist to remove the user id from each
    // friend object
    const friends = friendsList.map((friend) => {
      if (friend.friends[0].id === userId) {
        return { chatId: friend.id, friend: friend.friends[1] };
      }
      return { chatId: friend.id, friend: friend.friends[0] };
    });
    return NextResponse.json(friends, { status: 200 });
  } catch (error) {
    NextResponse.json({ error: 'Internal server error' });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string[] } },
) {
  const slug = params.id;
  const userId = slug[0];
  const friendId = slug[1];

  if (!userId || !friendId) {
    return NextResponse.json({ error: 'User ID and Friend ID are required' });
  }

  try {
    const existingFriendship = await prisma.friend.findFirst({
      where: {
        friendIds: {
          hasEvery: [userId, friendId],
        },
      },
    });

    if (existingFriendship) {
      return NextResponse.json({ error: 'Friendship already exists' });
    }

    const friendship = await prisma.friend.create({
      data: {
        friendIds: [userId, friendId],
      },
      include: {
        friends: true,
      },
    });

    return NextResponse.json(friendship, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const slug = params.id;
  const chatId = slug[0];

  if (!chatId) {
    return NextResponse.json({ error: 'No Chat here !' });
  }

  try {
    const friendship = await prisma.friend.delete({
      where: {
        id: chatId,
      },
    });

    return NextResponse.json(friendship, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' });
  }
}
