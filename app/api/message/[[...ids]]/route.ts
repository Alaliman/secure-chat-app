import { decrypt, encrypt } from '@/lib/crypto';
import { db } from '@/lib/prismadb';
import { pusherServer } from '@/lib/pusher';
import { NextResponse } from 'next/server';

const prisma = db;

export async function GET(
  req: Request,
  { params }: { params: { ids: string[] } },
) {
  const slug = params.ids;
  const chatId = slug[0];
  const userId = slug[1]?.trimEnd();

  try {
    const messages = await prisma.message.findMany({
      where: {
        chatId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        sender: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!messages)
      return NextResponse.json({ error: 'No Chat Found' }, { status: 404 });

    //Decrypt Messages
    if (messages.length > 0) {
      messages.forEach((message) => {
        message.content = userId ? decrypt(message.content) : message.content;
      });

      const newMessages = messages.map((message) => ({
        ...message,
        isSent: userId ? message.senderId === userId : 'for client use',
      }));

      return NextResponse.json(newMessages, { status: 200 });
    }

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', log: error });
  }
}

type incoming = {
  userId: string;
  content: string;
};

export async function POST(
  req: Request,
  { params }: { params: { ids: string[] } },
) {
  const chatId = params.ids[0]!;
  const data = (await req.json()) as incoming;
  console.log(data);
  const encryptedContent = encrypt(data.content);
  try {
    //tried to check if chat exist first, but no need, i guess
    const chat = await prisma.friend.findUnique({
      where: {
        id: chatId,
        friendIds: {
          has: data.userId.trim(),
        },
      },
    });

    if (!chat)
      return NextResponse.json(
        { error: 'No chat Found with user', ok: false },
        { status: 404 },
      );

    // removing user form chat
    const receiverId = chat.friendIds.filter((id) => id !== data.userId)[0];

    const message = await prisma.message.create({
      data: {
        chatId,
        senderId: data.userId.trimEnd(),
        content: encryptedContent,
      },
      include: {
        sender: {
          select: {
            name: true,
          },
        },
      },
    });

    // const message="my guy"
    // console.log(message)

    // Trigger Pusher event
    await pusherServer.trigger(`chat-${chatId}`, 'new-message', message);

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
