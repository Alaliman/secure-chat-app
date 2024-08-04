import { db } from '@/lib/prismadb';
import { pusherServer } from '@/lib/pusher';
import { NextApiRequest } from 'next';
import { getSession } from 'next-auth/react';
import { NextResponse } from 'next/server';

export async function POST(req: NextApiRequest) {
  try {
    const session = await getSession({ req });
    console.log(session);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { socket_id, channel_name } = await req.body();
    const userId = session.user.id;
    console.log(socket_id, channel_name, session);

    // Extract the chat ID from the channel name
    const chatId = channel_name.split('-')[2];
    console.log(chatId);

    // Check if the user is a participant in the chat
    const isParticipant = await db.friend.findFirst({
      where: {
        id: chatId,
        friendIds: {
          has: userId as string,
        },
      },
    });

    if (!isParticipant) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const auth = pusherServer.authorizeChannel(socket_id, channel_name);

    console.log(auth);

    return NextResponse.json(auth, { status: 200 });
  } catch (error) {
    console.error('Error authenticating:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
