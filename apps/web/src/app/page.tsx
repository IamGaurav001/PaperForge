"use client";

import { useState, useEffect } from "react";
import { TopNav } from "@/components/ui/TopNav";
import { Search, Filter, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { useJobStore } from "@/store/useJobStore";

import { useRouter } from "next/navigation";

export default function AssignmentsPage() {
  const { recentJobs, removeJob } = useJobStore();
  const [hasAssignments, setHasAssignments] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Determine if we have assignments to show based on local storage or API
    setHasAssignments(recentJobs.length > 0);
  }, [recentJobs]);

  return (
    <>
      <TopNav breadcrumb="Assignment" showBack={false} />
      
      <div className="flex-1 flex flex-col overflow-y-auto px-2 py-8">
        {hasAssignments ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Assignments
              </h2>
              <p className="text-sm text-gray-500 mt-1">Manage and create assignments for your classes.</p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-48">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Filter By" 
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <div className="relative flex-1 max-w-md ml-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search Assignment" 
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-24">
              {recentJobs.map((id, index) => (
                <div 
                  key={id} 
                  onClick={() => router.push(`/paper/${id}`)}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative group hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-12">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:underline">Quiz on Electricity {index > 0 ? `(${index + 1})` : ''}</h3>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeJob(id); }}
                      className="text-gray-400 hover:text-red-600 p-1 transition-colors relative z-10"
                      title="Delete Assignment"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold text-gray-600">
                    <p>Assigned on : 20-06-2025</p>
                    <p>Due : 21-06-2025</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating FAB */}
            <div className="fixed bottom-8 left-1/2 transform translate-x-[40px] z-50">
              <Link href="/create">
                <button className="bg-[#1A1A1A] hover:bg-black text-white px-6 py-3 rounded-full flex items-center gap-2 font-medium shadow-lg hover:scale-105 transition-transform">
                  <Plus className="w-5 h-5" />
                  Create Assignment
                </button>
              </Link>
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
              <button className="bg-[#1A1A1A] hover:bg-black text-white px-6 py-3 rounded-full flex items-center gap-2 font-medium shadow-md transition-transform hover:scale-105">
                <Plus className="w-5 h-5" />
                Create Your First Assignment
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
