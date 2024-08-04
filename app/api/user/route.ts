import { db } from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { z } from 'zod';

// export const UserSchema = z
//   .object({
//   username: z.string().min(1, {message:"username is required"}).max(100),
//   email: z.string().min(1, {message:"email is required"}).email({
//     message: "Enter a valid Email",
//   }),
//   password: z.string().min(1, {message:"Password is required"}).min(8, {message:"Password should have 8 characters"}),
// })

type User = {
  username: string;
  email: string;
  password: string;
};

export async function GET() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error(error);
  }
}

export async function POST(req: Request) {
  try {
    const body: User = await req.json();

    const { email, username, password } = body as User;
    //check if user exist
    const existUserEmail = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existUserEmail)
      return NextResponse.json(
        { user: null, message: ' user with the email already exist' },
        { status: 409 },
      );

    const hashedPassword = await hash(password, 10);

    const newUser = await db.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
      },
    });

    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      { user: rest, message: 'User created' },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'something went wrong' },
      { status: 500 },
    );
  }
}
