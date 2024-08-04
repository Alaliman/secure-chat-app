'use client';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

const SignOut = () => {
  return (
    <Button className="p-4" onClick={() => signOut()}>
      Sign Out
    </Button>
  );
};

export default SignOut;
