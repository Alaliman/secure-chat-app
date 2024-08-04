import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';

async function page() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect('/sign-in');

  return (
    <h2 className="text-2xl">
      {' '}
      Admin page - welcome back {session?.user?.username}
    </h2>
  );
}

export default page;
