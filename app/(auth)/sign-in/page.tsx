import SignInForm from '@/components/form/SignInForm';
import { getServerSession } from 'next-auth';
import React from 'react';
import { redirect } from 'next/navigation';

async function page() {
  const session = await getServerSession();

  if (session) {
    redirect('/chat');
  }
  return (
    <div className="">
      <SignInForm />
    </div>
  );
}

export default page;
