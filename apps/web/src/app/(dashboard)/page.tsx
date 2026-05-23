"use client";

import { useState, useEffect, useRef } from "react";
import { TopNav } from "@/components/ui/TopNav";
import { Search, Filter, MoreVertical, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useJobStore } from "@/store/useJobStore";

import { useRouter } from "next/navigation";

export default function AssignmentsPage() {
  const { recentJobs, removeJob } = useJobStore();
  const [hasAssignments, setHasAssignments] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Determine if we have assignments to show based on local storage or API
    setHasAssignments(recentJobs.length > 0);
  }, [recentJobs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <TopNav showBack={false} />
      
      <div className="flex-1 flex flex-col overflow-y-auto px-1 md:px-0 py-2 md:py-8 h-full relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {hasAssignments ? (
          <>
            {/* Desktop Header */}
            <div className="hidden md:block mb-5 pl-2">
              <h2 className="text-[24px] tracking-tight font-bold text-gray-900 flex items-center gap-3">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#A7F3D0]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
                </div>
                Assignments
              </h2>
              <p className="text-[14px] font-medium text-gray-400 mt-1 ml-8">Manage and create assignments for your classes.</p>
            </div>

            {/* Mobile Header */}
            <div className="flex md:hidden items-center justify-center relative mt-1 mb-5">
              <button onClick={() => router.back()} className="absolute left-0 w-10 h-10 flex items-center justify-center bg-[#E5E5E5] rounded-full hover:bg-gray-200 hover:scale-[1.05] active:scale-[0.95] transition-all">
                <ArrowLeft className="w-5 h-5 text-gray-800" />
              </button>
              <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">Assignments</h2>
            </div>

            {/* Desktop Filters Bar */}
            <div className="hidden md:flex w-full bg-white rounded-[22px] py-4 px-6 items-center justify-between shadow-sm mb-4">
              <div className="flex items-center gap-2 text-gray-400 cursor-pointer pl-2 hover:text-gray-600 transition-colors">
                <Filter className="w-5 h-5" />
                <span className="text-[15px] font-semibold text-gray-500">Filter By</span>
              </div>
              
              <div className="relative w-[400px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search Assignment" 
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-[14px] font-semibold text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200"
                />
              </div>
            </div>

            {/* Mobile Filters Bar */}
            <div className="flex md:hidden w-full bg-white rounded-full py-3.5 px-5 items-center justify-between shadow-sm mb-5">
              <div className="flex items-center gap-2 text-gray-400 cursor-pointer pl-1 hover:text-gray-600 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-[14px] font-medium text-gray-400">Filter</span>
              </div>
              <div className="w-[1.5px] h-4 bg-gray-200 mx-3"></div>
              <div className="flex items-center gap-2 flex-1">
                <Search className="w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search Name" 
                  className="w-full bg-transparent text-[14px] font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-3 pb-40 md:pb-32">
              {recentJobs.map((job: any, index) => {
                const jobId = typeof job === 'string' ? job : job.id;
                const jobTitle = typeof job === 'string' ? `Quiz on Electricity ${index > 0 ? `(${index + 1})` : ''}` : job.title;
                const jobAssigned = typeof job === 'string' ? "20-06-2025" : (job.assignedOn || "20-06-2025");
                const jobDue = typeof job === 'string' ? "21-06-2025" : (job.dueDate || "21-06-2025");
                
                return (
                <div 
                  key={jobId || index} 
                  className="bg-white rounded-[32px] md:rounded-[28px] p-6 md:p-8 border border-gray-100 shadow-sm relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => router.push(`/paper/${jobId}`)}
                >
                  <div className="flex justify-between items-start mb-5 md:mb-16">
                    <h3 className="text-[18px] md:text-[22px] font-black tracking-tight text-gray-900 group-hover:underline">{jobTitle}</h3>
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === jobId ? null : jobId);
                        }}
                        className="text-gray-900 hover:bg-gray-100 p-1 rounded-full transition-all hover:scale-110 active:scale-95"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {openDropdownId === jobId && (
                        <div 
                          ref={dropdownRef}
                          className="absolute right-0 top-8 w-40 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 flex flex-col"
                        >
                          <button onClick={(e) => { e.stopPropagation(); router.push(`/paper/${jobId}`); }} className="text-left px-4 py-2 text-[13px] font-semibold hover:bg-gray-50 text-gray-900 transition-colors">
                            View Assignment
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); removeJob(jobId); setOpenDropdownId(null); }} className="text-left px-4 py-2 text-[13px] font-semibold hover:bg-red-50 text-red-600 transition-colors">
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[12px] md:text-[13px] text-gray-500">
                    <p><span className="font-bold text-gray-900">Assigned on :</span> <span className="font-medium">{jobAssigned}</span></p>
                    <p><span className="font-bold text-gray-900">Due :</span> <span className="font-medium">{jobDue}</span></p>
                  </div>
                </div>
              )})}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center -mt-20">
            <div className="relative w-64 h-64 mb-6 flex items-center justify-center">
              {/* Using a structural placeholder for the Empty state SVG */}
              <div className="w-32 h-40 bg-white border-4 border-gray-200 rounded-lg shadow-sm relative z-10 flex flex-col items-center justify-center">
                <div className="w-16 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-12 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-100/50 rounded-full border-8 border-white shadow-lg flex items-center justify-center">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl">X</div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No assignments yet</h2>
            <p className="text-gray-500 text-center max-w-md mb-8 text-sm leading-relaxed">
              Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
            </p>
            <Link href="/create">
              <button className="bg-[#1A1A1A] hover:bg-black text-white px-6 py-3 rounded-full flex items-center gap-2 font-medium shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                <Plus className="w-5 h-5" />
                Create Your First Assignment
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Blur Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-[180px] md:h-[160px] pointer-events-none z-30 md:rounded-b-[32px] bg-[#ebebeb]/40 backdrop-blur-md [mask-image:linear-gradient(to_top,black_40%,transparent_100%)] -webkit-[mask-image:linear-gradient(to_top,black_40%,transparent_100%)]"></div>

      {/* Floating FAB - Desktop View */}
      {hasAssignments && (
        <div className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <Link href="/create">
            <button className="bg-[#1A1A1A] hover:bg-black text-white px-8 py-3.5 rounded-full flex items-center gap-2 text-[14px] font-bold shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl active:scale-[0.98] cursor-pointer">
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              Create Assignment
            </button>
          </Link>
        </div>
      )}

      {/* Floating FAB - Mobile View */}
      {hasAssignments && (
        <div className="md:hidden absolute bottom-[115px] right-6 z-40">
          <Link href="/create">
            <button className="w-[52px] h-[52px] bg-white text-[#FF4500] rounded-full flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] active:scale-[0.95] cursor-pointer">
              <Plus className="w-6 h-6" strokeWidth={3} />
            </button>
          </Link>
        </div>
      )}

      {/* Bottom Nav - Mobile View */}
      <div className="md:hidden w-full px-4 pb-6 absolute bottom-0 left-0 z-50">
        <nav className="bg-[#1A1A1A] rounded-[28px] px-6 py-5 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
          <Link href="/home" className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>
            <span className="text-[10px] font-medium text-white">Home</span>
          </Link>
          <Link href="/" className="flex flex-col items-center gap-1 text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6" stroke="black" strokeWidth="2"></line><line x1="8" y1="2" x2="8" y2="6" stroke="black" strokeWidth="2"></line><line x1="3" y1="10" x2="21" y2="10" stroke="black" strokeWidth="2"></line></svg>
            <span className="text-[10px] font-bold">Assignments</span>
          </Link>
          <Link href="/library" className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path><path d="M12 8v6"></path><path d="M9 11h6"></path></svg>
            <span className="text-[10px] font-medium text-white">Library</span>
          </Link>
          <Link href="/toolkit" className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1-1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>
            <span className="text-[10px] font-medium text-white">AI Toolkit</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
