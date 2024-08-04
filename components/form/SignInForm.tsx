'use client';
import React, { useState } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import GoogleSigninButton from '../GoogleSigninButton';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const FormSchema = z.object({
  email: z.string().min(1, { message: 'email is required' }).email({
    message: 'Enter a valid Email',
  }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password should have 8 characters' }),
});

function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [error, setError] = useState(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const signInData = await signIn('credentials', {
      ...data,
      redirect: false,
    });

    if (signInData?.error) {
      setError(false);
      if (signInData.error?.startsWith('Credential')) return setError(true);
      return toast.error('Oops! There was an error', {
        position: 'top-right',
        style: {
          background: 'red',
        },
      });
    }
    toast.success('Signing In....', {
      position: 'top-center',
      style: {
        background: 'green',
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 4000));
    router.refresh();
    router.push('/chat');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="mail.example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your Password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="mt-6 w-full" type="submit">
          Sign in
        </Button>
        <span
          className={error ? 'mt-2 block text-center text-red-400' : 'hidden'}
        >
          Email or Password is not correct
        </span>
      </form>
      <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
        or
      </div>
      <GoogleSigninButton>Sign in with Google</GoogleSigninButton>
      <p className="text-grey-600 mt-2 text-center text-sm">
        If you don&apos;t have an account, please&nbsp;
        <Link href="/sign-up" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
    </Form>
  );
}

export default SignInForm;
