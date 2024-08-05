import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import { Toaster } from 'sonner';
import { SessionProvider } from 'next-auth/react';
import { Providers } from '@/components/Provider';
const inter = Inter({ subsets: ['latin'] });
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactQueryProvider from './context/ReactQueryProvider';

export const metadata: Metadata = {
  title: 'Comfort Chat Secure App',
  description: 'coded by alali emmanuel',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="max-h-screen">
          <NavBar />
          <ReactQueryProvider>
            <Providers>{children}</Providers>
          </ReactQueryProvider>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
