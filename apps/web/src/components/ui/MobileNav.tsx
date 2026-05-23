"use client";
import { LayoutGrid, BookmarkPlus, Sparkles, NotebookText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MobileNav() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Home', icon: LayoutGrid, href: '/home' },
    { name: 'Assignments', icon: NotebookText, href: '/' },
    { name: 'Library', icon: BookmarkPlus, href: '/library' },
    { name: 'AI Toolkit', icon: Sparkles, href: '/toolkit' },
  ];

  return (
    <div className="md:hidden mt-auto shrink-0 relative w-full pb-2">
      {/* Floating Action Button */}
      <div className="absolute right-0 -top-[76px]">
        <Link href="/create">
          <button className="w-[56px] h-[56px] bg-white rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.12)] flex items-center justify-center text-[#F4511E] transition-transform active:scale-95">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </Link>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-[#1C1C1C] rounded-[32px] px-6 py-5 flex items-center justify-between shadow-lg">
        {navItems.map((item) => {
          const isActive = item.href === '/' ? (pathname === '/' || pathname.startsWith('/create')) : pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 transition-opacity">
              <item.icon className={`w-[24px] h-[24px] ${isActive ? 'text-white' : 'text-[#888888]'}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] tracking-tight ${isActive ? 'text-white font-bold' : 'text-[#888888] font-medium'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
