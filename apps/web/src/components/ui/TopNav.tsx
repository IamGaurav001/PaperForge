"use client";

import { Bell, ArrowLeft, Menu } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/store/useSessionStore';

export interface TopNavProps {
  breadcrumb?: string;
  showBack?: boolean;
}

export function TopNav({ breadcrumb = "Assignment", showBack = true }: TopNavProps) {
  const router = useRouter();

  return (
    <div className="w-full h-auto flex flex-col justify-center shrink-0 mb-0 md:mb-0">
      <div className="h-[64px] md:h-[56px] w-full bg-white rounded-[20px] md:rounded-[20px] px-4 md:px-6 flex items-center justify-between shadow-sm border border-gray-100 shrink-0">
        
        {/* Desktop Left side */}
        <div className="hidden md:flex items-center gap-4">
          {showBack && (
            <button 
              onClick={() => router.back()} 
              className="w-[40px] h-[40px] flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2 h-[20px]">
            {!showBack ? (
              <div className="w-4 h-4 text-gray-400 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </div>
            ) : (
              <div className="w-4 h-4 text-gray-400 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2L11.8 7.8L17.6 9.6L11.8 11.4L10 17.2L8.2 11.4L2.4 9.6L8.2 7.8L10 2Z" />
                  <path d="M19 14L19.9 16.9L22.8 17.8L19.9 18.7L19 21.6L18.1 18.7L15.2 17.8L18.1 16.9L19 14Z" />
                </svg>
              </div>
            )}
            <span className="text-[14px] font-medium text-gray-500">{breadcrumb}</span>
          </div>
        </div>

        {/* Mobile Left side */}
        <div className="flex md:hidden items-center gap-2.5">
          <div className="w-[36px] h-[36px] rounded-[10px] bg-[#2B2B2B] flex items-center justify-center shrink-0 shadow-sm">
            <svg viewBox="0 0 32 32" fill="none" className="w-[20px] h-[20px]">
              <path d="M26 6L16 28H10L18 6H26Z" fill="#E2E8F0" />
              <path d="M6 6L16 28H10L4 6H6Z" fill="white" />
            </svg>
          </div>
          <span className="text-[20px] font-extrabold tracking-tight text-[#2B2B2B]">VedaAI</span>
        </div>

        {/* Right side (Desktop & Mobile) */}
        <div className="flex items-center gap-2.5 md:gap-5 h-full">
          <button className="w-[36px] h-[36px] md:w-[38px] md:h-[38px] bg-[#F4F4F5] md:bg-[#F9FAFB] flex items-center justify-center relative transition-colors rounded-full hover:bg-gray-200 shrink-0">
            <Bell className="w-[20px] h-[20px] md:w-5 md:h-5 text-[#2B2B2B]" strokeWidth={2.5} />
            <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-[12px] h-[12px] md:w-[14px] md:h-[14px] bg-[#FF5733] rounded-full border-2 border-[#F4F4F5] md:border-[#F9FAFB]"></span>
          </button>
          
          <div className="flex items-center gap-2.5 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity h-[36px] md:h-[36px]">
            <div className="w-[36px] h-[36px] md:w-[34px] md:h-[34px] rounded-full overflow-hidden shrink-0">
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop" alt="User" className="w-full h-full object-cover bg-gray-50" />
            </div>
            <span className="text-[15px] font-semibold text-gray-800 hidden md:block">
              {useSessionStore((state) => state.teacherName) || 'Teacher'}
            </span>
            <svg className="w-5 h-5 text-gray-800 shrink-0 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            <Menu className="w-7 h-7 text-[#2B2B2B] block md:hidden ml-1" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>
  );
}
