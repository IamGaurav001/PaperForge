"use client";

import Link from 'next/link';
import { LayoutGrid, Contact, FileText, Book, History, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useJobStore } from '@/store/useJobStore';
import { useUIStore } from '@/store/useUIStore';
import { Logo } from './Logo';

export function Sidebar() {
  const pathname = usePathname();
  const recentJobs = useJobStore((state) => state.recentJobs);
  const assignmentsCount = recentJobs.length;

  const navItems = [
    { name: 'Home', icon: LayoutGrid, href: '/home' },
    { name: 'My Groups', icon: Contact, href: '/groups' },
    { name: 'Assignments', icon: FileText, href: '/' },
    { name: 'AI Teacher\'s Toolkit', icon: Book, href: '/toolkit' },
    { name: 'My Library', icon: History, href: '/library' },
  ];

  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100] md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className={`
        fixed inset-y-0 left-0 z-[110] transform transition-transform duration-300 ease-in-out
        md:relative md:transform-none md:z-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex print:hidden w-[304px] h-full bg-white md:rounded-[32px] shadow-2xl flex-col shrink-0
      `}>
      {/* Logo */}
      <div className="pt-8 px-[26px] shrink-0">
        <Logo />
      </div>

      {/* Action Button */}
      <div className="px-[26px] mt-10 shrink-0 flex justify-center">
        <Link href="/create" onClick={() => setSidebarOpen(false)} className="block w-full group cursor-pointer">
          <div className="w-full h-[48px] rounded-full bg-gradient-to-b from-[#F48F60] to-[#CD462F] p-[2px] shadow-[0_8px_16px_-6px_rgba(205,70,47,0.5)] transition-all duration-300 group-hover:shadow-[0_12px_20px_-6px_rgba(205,70,47,0.6)] group-hover:scale-[1.02] group-active:scale-[0.98]">
            <button className="w-full h-full bg-[#2e2e2e] group-hover:bg-[#252525] text-white rounded-full flex items-center justify-center gap-2.5 text-[15px] font-semibold transition-colors cursor-pointer pointer-events-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2L11.8 7.8L17.6 9.6L11.8 11.4L10 17.2L8.2 11.4L2.4 9.6L8.2 7.8L10 2Z" />
                <path d="M19 14L19.9 16.9L22.8 17.8L19.9 18.7L19 21.6L18.1 18.7L15.2 17.8L18.1 16.9L19 14Z" />
              </svg>
              Create Assignment
            </button>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-[26px] mt-10 space-y-[12px] overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.href === '/' ? (pathname === '/' || pathname.startsWith('/create') || pathname.startsWith('/paper') || pathname.startsWith('/generate')) : pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className="block" onClick={() => setSidebarOpen(false)}>
              <div className={`flex items-center gap-3.5 px-3.5 py-[10px] rounded-[14px] transition-colors ${isActive ? 'bg-[#F3F4F6]' : 'hover:bg-gray-50'}`}>
                <item.icon className={`w-[20px] h-[20px] ${isActive ? 'text-[#2B2B2B]' : 'text-gray-500'}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[14px] ${isActive ? 'font-semibold text-[#2B2B2B]' : 'font-medium text-gray-500'} flex-1 tracking-tight`}>
                  {item.name}
                </span>
                {item.name === 'Assignments' && assignmentsCount > 0 && (
                  <span className="bg-[#FF5733] text-white text-[12px] font-bold px-2.5 py-[2px] rounded-full leading-none">{assignmentsCount}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-6 pb-6 shrink-0 pt-4">
        <Link href="/settings" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3.5 px-3.5 py-3 text-gray-500 hover:text-gray-900 transition-colors mb-3 rounded-xl hover:bg-gray-50">
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
    </>
  );
}
