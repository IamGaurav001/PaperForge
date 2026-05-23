"use client";

import Link from 'next/link';
import { LayoutGrid, Contact, FileText, Book, History, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', icon: LayoutGrid, href: '/home' },
    { name: 'My Groups', icon: Contact, href: '/groups' },
    { name: 'Assignments', icon: FileText, href: '/' },
    { name: 'AI Teacher\'s Toolkit', icon: Book, href: '/toolkit' },
    { name: 'My Library', icon: History, href: '/library' },
  ];

  return (
    <div className="hidden md:flex w-[304px] h-full bg-white rounded-[32px] shadow-sm flex-col relative shrink-0">
      {/* Logo */}
      <div className="pt-8 px-[26px] pb-8 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-[#C23927] flex items-center justify-center relative">
          <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
            <path d="M26 6L16 28H10L18 6H26Z" fill="#E2E8F0" />
            <path d="M6 6L16 28H10L4 6H6Z" fill="white" />
          </svg>
        </div>
        <span className="text-[26px] font-extrabold tracking-tight text-[#2B2B2B]">VedaAI</span>
      </div>

      {/* Action Button */}
      <div className="px-[26px] mb-8 shrink-0 flex justify-center">
        <Link href="/create" className="block w-[251px]">
          <div className="w-full h-[42px] rounded-full bg-gradient-to-b from-[#F48F60] to-[#CD462F] p-[2.5px] shadow-[0_8px_16px_-6px_rgba(205,70,47,0.5)]">
            <button className="w-full h-full bg-[#2e2e2e] hover:bg-[#252525] text-white rounded-full flex items-center justify-center gap-2.5 text-[14px] font-medium transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2L11.8 7.8L17.6 9.6L11.8 11.4L10 17.2L8.2 11.4L2.4 9.6L8.2 7.8L10 2Z" />
                <path d="M19 14L19.9 16.9L22.8 17.8L19.9 18.7L19 21.6L18.1 18.7L15.2 17.8L18.1 16.9L19 14Z" />
              </svg>
              Create Assignment
            </button>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-[26px] space-y-[6px] overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.href === '/' ? (pathname === '/' || pathname.startsWith('/create') || pathname.startsWith('/paper') || pathname.startsWith('/generate')) : pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className="block">
              <div className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-colors ${isActive ? 'bg-[#F3F4F6]' : 'hover:bg-gray-50'}`}>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-gray-900' : 'text-gray-500'}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[14px] ${isActive ? 'font-bold text-gray-900' : 'font-medium text-gray-500'} flex-1`}>
                  {item.name}
                </span>
                {item.name === 'Assignments' && (
                  <span className="bg-[#FF5733] text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-none">10</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-6 pb-6 shrink-0 pt-4">
        <Link href="/settings" className="flex items-center gap-3.5 px-3.5 py-3 text-gray-500 hover:text-gray-900 transition-colors mb-3 rounded-xl hover:bg-gray-50">
          <Settings className="w-5 h-5" strokeWidth={2} />
          <span className="text-[14px] font-medium">Settings</span>
        </Link>
        <div className="bg-[#F3F4F6] rounded-2xl p-3 flex items-center gap-3.5">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=school" alt="School" className="w-[42px] h-[42px] rounded-full bg-[#FFE4D6] shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] font-bold text-gray-900 truncate">Delhi Public School</span>
            <span className="text-[12px] font-medium text-gray-500 truncate mt-0.5">Bokaro Steel City</span>
          </div>
        </div>
      </div>
    </div>
  );
}
