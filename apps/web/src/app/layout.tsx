import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/ui/Sidebar';
import { MobileNav } from '@/components/ui/MobileNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VedaAI - Hiring Assignment',
  description: 'AI-powered assessment creator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#ebebeb] text-gray-900 h-[100dvh] w-screen overflow-hidden antialiased flex flex-col md:flex-row p-4 md:p-4 gap-4`}>
        <Sidebar />
        <main className="flex-1 h-full flex flex-col overflow-hidden relative">
          {children}
        </main>
        <MobileNav />
      </body>
    </html>
  );
}
