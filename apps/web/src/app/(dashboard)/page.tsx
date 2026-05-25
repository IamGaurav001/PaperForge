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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState<"Newest" | "Oldest">("Newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const desktopFilterRef = useRef<HTMLDivElement>(null);
  const mobileFilterRef = useRef<HTMLDivElement>(null);
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
      const isOutsideDesktop = desktopFilterRef.current ? !desktopFilterRef.current.contains(event.target as Node) : true;
      const isOutsideMobile = mobileFilterRef.current ? !mobileFilterRef.current.contains(event.target as Node) : true;
      if (isOutsideDesktop && isOutsideMobile) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Normalize jobs first so that string-based jobs keep their original index-based title
  const normalizedJobs = recentJobs.map((job: any, index: number) => ({
    id: typeof job === 'string' ? job : job.id,
    title: typeof job === 'string' ? `Quiz on Electricity ${index > 0 ? `(${index + 1})` : ''}` : job.title,
    assignedOn: typeof job === 'string' ? "20-06-2025" : (job.assignedOn || "20-06-2025"),
    dueDate: typeof job === 'string' ? "21-06-2025" : (job.dueDate || "21-06-2025"),
  }));

  let filteredJobs = normalizedJobs.filter((job) => {
    return job.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (filterOption === "Oldest") {
    filteredJobs = filteredJobs.reverse();
  }

  return (
    <>
      <div className="absolute top-0 left-0 right-0 z-40 bg-[linear-gradient(to_bottom,#ebebeb_0%,#ebebeb_75%,transparent_100%)] pb-4 md:pb-6 pt-1 md:pt-2 pointer-events-none">
        <div className="pointer-events-auto px-1 md:px-0">
          <TopNav showBack={false} />
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto px-1 md:px-0 h-full relative w-full">
        {/* Spacer for absolute TopNav */}
        <div className="w-full h-[76px] md:h-[88px] shrink-0"></div>
      
      <div className="flex-1 flex flex-col h-full relative">
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
            <div className="flex md:hidden items-center justify-center relative mt-6 mb-7 px-2">
              <button onClick={() => router.back()} className="absolute left-2 w-10 h-10 flex items-center justify-center bg-[#E5E5E5] rounded-full hover:bg-gray-200 hover:scale-[1.05] active:scale-[0.95] transition-all">
                <ArrowLeft className="w-5 h-5 text-gray-800" />
              </button>
              <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">Assignments</h2>
            </div>

            {/* Desktop Filters Bar */}
            <div className="hidden md:flex w-full bg-white rounded-[16px] py-3 px-5 items-center justify-between shadow-sm mb-6 relative z-10" ref={desktopFilterRef}>
              <div 
                className="flex items-center gap-2 text-gray-400 cursor-pointer pl-2 hover:text-gray-600 transition-colors relative"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="w-4 h-5" />
                <span className="text-[15px] font-semibold text-gray-500">
                  Filter By
                </span>
                
                {isFilterOpen && (
                  <div className="absolute top-8 left-0 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 flex flex-col">
                    <button 
                      onClick={() => setFilterOption("Newest")} 
                      className={`text-left px-4 py-2 text-[13px] font-semibold transition-colors ${filterOption === "Newest" ? "bg-gray-100 text-gray-900" : "hover:bg-gray-50 text-gray-600"}`}
                    >
                      Newest First
                    </button>
                    <button 
                      onClick={() => setFilterOption("Oldest")} 
                      className={`text-left px-4 py-2 text-[13px] font-semibold transition-colors ${filterOption === "Oldest" ? "bg-gray-100 text-gray-900" : "hover:bg-gray-50 text-gray-600"}`}
                    >
                      Oldest First
                    </button>
                  </div>
                )}
              </div>
              
              <div className="relative w-[320px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search Assignment" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-[14px] font-medium text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-gray-300 transition-colors"
                />
              </div>
            </div>

            {/* Mobile Filters Bar */}
            <div className="flex md:hidden w-full bg-white rounded-[24px] p-2 items-center shadow-[0_2px_10px_rgba(0,0,0,0.04)] mb-5 relative z-10" ref={mobileFilterRef}>
              <div 
                className="flex items-center gap-2 text-[#A1A1AA] cursor-pointer px-3 hover:text-gray-600 transition-colors relative whitespace-nowrap shrink-0"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="w-[18px] h-[18px]" strokeWidth={2} />
                <span className="text-[15px] font-medium">
                  Filter {filterOption === "Oldest" ? "(Oldest)" : ""}
                </span>
                
                {isFilterOpen && (
                  <div className="absolute top-10 left-0 w-40 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 flex flex-col">
                    <button 
                      onClick={() => setFilterOption("Newest")} 
                      className={`text-left px-4 py-2 text-[13px] font-semibold transition-colors ${filterOption === "Newest" ? "bg-gray-100 text-gray-900" : "hover:bg-gray-50 text-gray-600"}`}
                    >
                      Newest First
                    </button>
                    <button 
                      onClick={() => setFilterOption("Oldest")} 
                      className={`text-left px-4 py-2 text-[13px] font-semibold transition-colors ${filterOption === "Oldest" ? "bg-gray-100 text-gray-900" : "hover:bg-gray-50 text-gray-600"}`}
                    >
                      Oldest First
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2.5 flex-1 border border-[#E4E4E7] rounded-full px-4 py-2.5 ml-1 bg-white">
                <Search className="w-[18px] h-[18px] text-[#A1A1AA]" strokeWidth={2} />
                <input 
                  type="text" 
                  placeholder="Search Name" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-[15px] font-medium text-[#1A1A1A] placeholder:text-[#A1A1AA] focus:outline-none"
                />
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-3 pb-40 md:pb-32">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => {
                  return (
                  <div 
                    key={job.id} 
                    className="bg-white rounded-[24px] p-5 md:px-7 md:py-6 shadow-sm relative group hover:shadow-md transition-all duration-300 cursor-pointer"
                    onClick={() => router.push(`/paper/${job.id}`)}
                  >
                    <div className="flex justify-between items-start mb-6 md:mb-8">
                      <h3 className="text-[17px] md:text-[19px] font-bold tracking-tight text-[#1A1A1A] group-hover:underline pr-8">{job.title}</h3>
                      <div className="absolute right-5 top-5 md:right-6 md:top-6">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(openDropdownId === job.id ? null : job.id);
                          }}
                          className="text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors rounded-full p-1.5 -mr-1.5 -mt-1.5 cursor-pointer flex items-center justify-center"
                        >
                          <MoreVertical className="w-[20px] h-[20px]" />
                        </button>
                        
                        {openDropdownId === job.id && (
                          <div 
                            ref={dropdownRef}
                            className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-20 flex flex-col"
                          >
                            <button onClick={(e) => { e.stopPropagation(); router.push(`/paper/${job.id}`); }} className="text-left px-4 py-2 text-[13px] font-semibold hover:bg-gray-50 text-[#1A1A1A] transition-colors">
                              View Assignment
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); removeJob(job.id); setOpenDropdownId(null); }} className="text-left px-4 py-2 text-[13px] font-semibold hover:bg-red-50 text-red-600 transition-colors">
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[12px] md:text-[13px]">
                      <p><span className="font-bold text-[#202020]">Assigned on :</span> <span className="font-medium text-gray-500">{job.assignedOn}</span></p>
                      <p><span className="font-bold text-[#202020]">Due :</span> <span className="font-medium text-gray-500">{job.dueDate}</span></p>
                    </div>
                  </div>
                )})
              ) : (
                <div className="col-span-1 lg:col-span-2 py-10 flex flex-col items-center justify-center text-gray-500">
                  <Search className="w-10 h-10 mb-3 opacity-20" />
                  <p className="text-sm font-medium">No assignments found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center -mt-20">
            <div className="relative w-[340px] h-[300px] mb-2 flex items-center justify-center">
              {/* Base Circle */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-[#F1F3F5] rounded-full"></div>
              
              {/* Decorative elements */}
              {/* Squiggle Top Left */}
              <svg className="absolute left-[38px] top-[70px] w-16 h-16 text-[#0F1C2D] z-0" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 60 C40 50, 45 30, 35 25 C25 20, 15 30, 25 45 C40 65, 70 40, 80 20" />
              </svg>

              {/* Sparkle Bottom Left */}
              <svg className="absolute bottom-[75px] left-[70px] w-[20px] h-[20px] text-[#386692] z-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 Q12 12 2 12 Q12 12 12 22 Q12 12 22 12 Q12 12 12 2Z" />
              </svg>

              {/* Dot Right */}
              <div className="absolute bottom-[115px] right-[65px] w-[11px] h-[11px] bg-[#386692] rounded-full z-0"></div>
              
              {/* Floating window Top Right */}
              <div className="absolute top-[65px] right-[75px] w-[64px] h-[38px] bg-white rounded-[12px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex items-center justify-center gap-[7px] z-10 px-3">
                <div className="w-[8px] h-[8px] rounded-full bg-[#B7ACCF] shrink-0"></div>
                <div className="w-[20px] h-[10px] rounded-full bg-[#B4BBC6] shrink-0"></div>
              </div>

              {/* Document */}
              <div className="relative z-10 w-[118px] h-[148px] bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col p-[18px] ml-[-16px] mt-[-10px]">
                <div className="w-[34px] h-[8px] bg-[#0F1C2D] rounded-full mb-[22px]"></div>
                <div className="w-[58px] h-[8px] bg-[#E1E4E8] rounded-full mb-[14px]"></div>
                <div className="w-[58px] h-[8px] bg-[#E1E4E8] rounded-full mb-[14px]"></div>
                <div className="w-[58px] h-[8px] bg-[#E1E4E8] rounded-full mb-[14px]"></div>
                <div className="w-[42px] h-[8px] bg-[#E1E4E8] rounded-full"></div>
              </div>

              {/* Magnifying Glass with Red X */}
              <div className="absolute z-20 bottom-[35px] right-[70px] w-32 h-32 flex items-center justify-center">
                {/* The glass ring */}
                <div className="relative w-[110px] h-[110px] bg-white/40 backdrop-blur-md rounded-full border-[12px] border-[#DCD5E4] shadow-[0_12px_24px_rgba(0,0,0,0.06)] flex items-center justify-center">
                  {/* Red X */}
                  <div className="relative w-10 h-10 flex items-center justify-center z-10">
                    <div className="absolute w-[36px] h-[8px] bg-[#FA4A4D] rounded-full rotate-45"></div>
                    <div className="absolute w-[36px] h-[8px] bg-[#FA4A4D] rounded-full -rotate-45"></div>
                  </div>
                  {/* Handle */}
                  <div className="absolute -bottom-[32px] -right-[24px] w-[50px] h-[16px] bg-[#DCD5E4] rounded-full rotate-[42deg]"></div>
                </div>
              </div>
            </div>
            
            <h2 className="text-[20px] font-bold text-[#202020] mb-3">No assignments yet</h2>
            <p className="text-[#767676] text-center max-w-[440px] mb-8 text-[14px] leading-[1.6]">
              Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
            </p>
            <Link href="/create">
              <button className="bg-[#191919] hover:bg-black text-white px-7 py-3 rounded-full flex items-center gap-2 text-[15px] font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm">
                <Plus className="w-[18px] h-[18px]" strokeWidth={2} />
                Create Your First Assignment
              </button>
            </Link>
          </div>
        )}
      </div>
      </div>

      {/* Bottom Fade Effect */}
      <div className="fixed md:absolute bottom-0 left-0 right-0 w-full md:w-auto h-[160px] md:h-[120px] pointer-events-none z-30 bg-gradient-to-t from-[#ebebeb] via-[#ebebeb]/80 to-transparent"></div>

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
        <div className="md:hidden absolute bottom-[104px] right-6 z-[60]">
          <Link href="/create">
            <button className="w-[50px] h-[50px] bg-white text-[#FF4500] rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] cursor-pointer">
              <Plus className="w-6 h-6" strokeWidth={2.5} />
            </button>
          </Link>
        </div>
      )}

      {/* Bottom Nav - Mobile View */}
      <div className="md:hidden w-full px-4 pb-6 fixed bottom-0 left-0 z-50">
        <nav className="bg-[#1A1A1A] rounded-[24px] px-6 py-4 flex items-center justify-between shadow-2xl">
          <Link href="/home" className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>
            <span className="text-[10px] font-medium text-white">Home</span>
          </Link>
          <Link href="/" className="flex flex-col items-center gap-1 text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
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
