import SignUpForm from '@/components/form/SignUpForm';
import { getServerSession } from 'next-auth';
import React from 'react';
import { redirect } from 'next/navigation';

async function page() {
  const session = await getServerSession();

  if (session) {
    return redirect('/chat');
  }
  return (
    <div>
      <SignUpForm />
    </div>
  );
}

export default page;
