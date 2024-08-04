import ChatContextProvider from '@/app/context/chatContext';
import Chat from '@/components/Chat';
import Sidebar from '@/components/SideBar';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';

async function page() {
  const session = await getServerSession(authOptions);

  const user = session?.user ? session.user : null;

  if (!user) redirect('/sign-in');

  return (
    <div className="mt-[56.8px] flex h-[calc(100vh-56.8px)] w-full items-center justify-center">
      <ChatContextProvider>
        <div className="flex h-full w-full flex-col justify-between gap-1 md:h-5/6 md:w-[80%] md:flex-row">
          <div className="mb-4 w-full md:mb-0 md:h-full md:w-1/4">
            <Sidebar />
          </div>
          <div className="w-full grow md:h-full md:w-3/4">
            <Chat />
          </div>
        </div>
      </ChatContextProvider>
    </div>
  );
}

export default page;
