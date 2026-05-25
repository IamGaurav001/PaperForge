"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { JobState } from "@paperforge/types";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, BrainCircuit, Sparkles, Loader2, FileText, PenTool } from "lucide-react";
import { TopNav } from "@/components/ui/TopNav";

const getLoadingMessage = (p: number) => {
  if (p < 15) return "Analyzing assignment parameters...";
  if (p < 35) return "Synthesizing curriculum constraints...";
  if (p < 60) return "Generating diverse question types...";
  if (p < 85) return "Calibrating difficulty levels...";
  if (p < 98) return "Formatting question paper...";
  return "Finalizing output...";
};

export default function GenerateStatusPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  
  const [status, setStatus] = useState<JobState["status"]>("QUEUED");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use environment variable for backend URL in production, fallback to localhost for dev
    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001");

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socket.on("jobUpdate", (data: JobState) => {
      if (data.jobId === jobId) {
        setStatus(data.status);
        setProgress(data.progress);
        
        if (data.status === "FAILED") {
          setError(data.error || "Generation failed");
        } else if (data.status === "COMPLETED") {
          // Delay redirect slightly for UX
          setTimeout(() => {
            router.push(`/paper/${jobId}`);
          }, 1500);
        }
      }
    });

    // Initial fetch in case socket missed the initial state
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/assignments/job/${jobId}`)
      .then(res => res.json())
      .then(data => {
        if (data.status) {
          setStatus(data.status);
          setProgress(data.progress);
          if (data.status === "COMPLETED") {
            router.push(`/paper/${jobId}`);
          }
        }
      })
      .catch(console.error);

    return () => {
      socket.disconnect();
    };
  }, [jobId, router]);

  const renderContent = () => {
    if (status === "FAILED") {
      return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-8">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-[24px] font-black text-gray-900 mb-2 tracking-tight">Generation Failed</h2>
          <p className="text-[14px] font-medium text-gray-500 max-w-md">{error}</p>
          <button onClick={() => router.back()} className="mt-8 px-8 py-3 bg-[#1A1A1A] text-white text-[14px] font-bold rounded-full hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md">
            Go Back & Try Again
          </button>
        </motion.div>
      );
    }

    if (status === "COMPLETED") {
      return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)] relative"
          >
            <motion.div 
              className="absolute inset-0 rounded-full border-2 border-green-400"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={2.5} />
          </motion.div>
          <h2 className="text-[28px] font-black text-gray-900 tracking-tight mb-2">Ready to Print!</h2>
          <p className="text-[15px] font-medium text-gray-500">Your assignment has been perfectly crafted.</p>
        </motion.div>
      );
    }

    // Generating State
    return (
      <div className="flex flex-col items-center w-full relative z-10 py-6 md:py-10">
        
        {/* Animated Brain Icon Container */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-12">
          {/* Orbital rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-gray-300"
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm">
              <div className="w-1.5 h-1.5 bg-[#F48F60] rounded-full"></div>
            </div>
          </motion.div>
          
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            className="absolute -inset-6 rounded-full border border-gray-200/60"
          >
            <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-5 h-5 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm">
              <Sparkles className="w-2.5 h-2.5 text-[#CD462F]" />
            </div>
            <div className="absolute bottom-4 right-2 w-4 h-4 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm">
              <PenTool className="w-2 h-2 text-gray-600" />
            </div>
          </motion.div>

          {/* Core glow and icon */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute inset-4 bg-gradient-to-tr from-[#F48F60] to-[#CD462F] rounded-full blur-[24px]"
          />
          <div className="relative w-20 h-20 bg-white rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex items-center justify-center border border-gray-50 overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-tr from-[#F48F60]/10 to-[#CD462F]/10"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <BrainCircuit className="w-9 h-9 text-[#0A0D14] relative z-10" strokeWidth={1.5} />
          </div>
        </div>
        
        {/* Progress Percentage */}
        <div className="flex items-baseline gap-1 mb-2">
          <motion.span 
            key={progress}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-[56px] font-black text-gray-900 tracking-tighter tabular-nums leading-none"
          >
            {progress}
          </motion.span>
          <span className="text-[24px] font-bold text-gray-400">%</span>
        </div>

        {/* Dynamic Text */}
        <div className="h-6 mb-10 overflow-hidden relative w-full flex justify-center">
          <AnimatePresence mode="wait">
            <motion.p 
              key={getLoadingMessage(progress)}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-[14px] md:text-[15px] font-semibold text-gray-500 absolute whitespace-nowrap"
            >
              {status === "QUEUED" ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  Waiting in queue...
                </span>
              ) : getLoadingMessage(progress)}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Sleek Progress Bar */}
        <div className="w-full max-w-sm bg-[#F0F1F3] rounded-full h-2 overflow-hidden relative shadow-inner">
          <motion.div 
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#F48F60] to-[#CD462F] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.5 }}
          />
          {/* Shimmer effect on bar */}
          <motion.div 
            className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
            animate={{ left: ['-50%', '150%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <TopNav showBack={false} />
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-[#ebebeb] h-full overflow-hidden">
        <div className="w-full max-w-xl bg-white rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-50 p-6 md:p-12 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#F48F60] to-[#CD462F] opacity-80"></div>
          {renderContent()}
        </div>
      </div>
    </>
  );
}
