import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

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
      <body className={`${inter.className} bg-[#ebebeb] text-gray-900 h-[100dvh] w-screen overflow-hidden antialiased`}>
        {children}
      </body>
    </html>
  );
}
