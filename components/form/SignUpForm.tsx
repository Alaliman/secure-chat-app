'use client';
import React from 'react';
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
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const FormSchema = z
  .object({
    username: z.string().min(1, { message: 'username is required' }).max(100),
    email: z.string().min(1, { message: 'email is required' }).email({
      message: 'Enter a valid Email',
    }),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(8, { message: 'Password should have 8 characters' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(8, { message: 'Password should have 8 characters' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'passwords do not match',
  });

function SignUpForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const controller = new AbortController();
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application / json' },
      });

      if (!res.ok) return toast.error('Resgisteration Failed');

      router.push('/sign-in');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Re-Enter your Password</FormLabel>
                <FormControl>
                  <Input placeholder="12345678" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="mt-6 w-full" type="submit">
          Sign up
        </Button>
      </form>
      <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
        or
      </div>
      <GoogleSigninButton>Sign up with Google</GoogleSigninButton>
      <p className="text-grey-600 mt-2 text-center text-sm">
        If you have an account, please&nbsp;
        <Link href="/sign-in" className="text-blue-500 hover:underline">
          Sign in
        </Link>
      </p>
    </Form>
  );
}

export default SignUpForm;
