"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store/useSessionStore";
import { ArrowRight, User } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function WelcomePage() {
  const router = useRouter();
  const hasSession = useSessionStore((state) => state.hasSession);
  const setSession = useSessionStore((state) => state.setSession);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    setMounted(true);
    if (hasSession) {
      router.push("/");
    }
  }, [hasSession, router]);

  if (!mounted || hasSession) return null;

  const handleContinue = () => {
    if (!nameInput.trim()) return;
    setIsLoading(true);
    // Simulate a slight loading delay for a premium feel
    setTimeout(() => {
      setSession(true, nameInput.trim());
      router.push("/");
    }, 600);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#E5E5E5] flex items-center justify-center p-3 md:p-8">
      {/* Main Container */}
      <div className="w-full max-w-5xl bg-white rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col md:flex-row shadow-sm">
        
        {/* Left Side: Branding & Info */}
        <div className="w-full md:w-1/2 p-5 pb-4 md:p-16 flex flex-col justify-between bg-[#FAFAFA] relative">
          <div>
            {/* Logo */}
            <div className="mb-4 md:mb-20">
              <Logo textSize="text-[18px] md:text-[20px]" />
            </div>

            {/* Typography */}
            <h1 className="text-[28px] md:text-[52px] font-black text-[#0A0D14] leading-[1.05] tracking-tight mb-3 md:mb-8">
              Welcome to VedaAI
            </h1>
            <p className="text-[13px] md:text-[15px] text-gray-500 font-semibold leading-[1.4] md:leading-[1.6] max-w-full md:max-w-[85%]">
              AI-powered assessment creation for modern classrooms. Streamline your workflow and generate high-quality question papers in seconds.
            </p>
          </div>

          {/* Academic Illustration / Accent */}
          <div className="mt-4 md:mt-24">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white border border-gray-100 shadow-sm">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500"></div>
              <span className="text-[10px] md:text-[12px] font-bold text-gray-700">System Online</span>
            </div>
          </div>
        </div>

        {/* Right Side: Workspace Selection */}
        <div className="w-full md:w-1/2 p-5 pt-3 md:p-16 flex flex-col items-center justify-center bg-white">
          
          <div className="w-full max-w-sm flex flex-col items-center">
            <h2 className="text-[11px] md:text-[12px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3 md:mb-4 text-center">Select Workspace</h2>

            {/* Workspace Card */}
            <div className="w-full bg-[#F9F9FA] rounded-[20px] md:rounded-[24px] p-4 md:p-6 mb-5 md:mb-8 relative overflow-hidden text-left border border-gray-50 hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1.5 md:h-2 bg-[#0A0D14]"></div>
              
              <div className="flex items-start gap-3 md:gap-4 mt-1">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#F0F1F3] flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                  <User className="w-4 h-4 md:w-6 md:h-6 text-gray-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-[14px] md:text-[17px] font-black text-[#0A0D14]">Delhi Public School</h3>
                  </div>
                  <p className="text-[12px] md:text-[13px] font-semibold text-gray-500 flex items-center gap-1.5 mb-2 md:mb-2.5">
                    Role: <span className="text-[#0A0D14]">Teacher</span>
                  </p>
                  <div className="inline-flex items-center px-2 py-0.5 rounded-[6px] bg-[#F0F1F3] text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-wider">
                    Demo Workspace
                  </div>
                </div>
              </div>
            </div>

            {/* Name Input */}
            <div className="w-full mb-4 md:mb-6">
              <label htmlFor="teacherName" className="block text-[11px] md:text-[12px] font-bold text-gray-500 mb-1.5 md:mb-2 uppercase tracking-wide">Your Name</label>
              <input
                id="teacherName"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your name to continue..."
                className="w-full h-[46px] md:h-[52px] px-4 rounded-[14px] md:rounded-[16px] bg-[#F9F9FA] border border-gray-200 text-[#0A0D14] text-[14px] md:text-[15px] font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C23927]/20 focus:border-[#C23927] transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleContinue();
                  }
                }}
              />
            </div>

            {/* CTA */}
            <button
              onClick={handleContinue}
              disabled={isLoading || !nameInput.trim()}
              className={`w-full h-[46px] md:h-[52px] rounded-full bg-gradient-to-b from-[#F48F60] to-[#CD462F] p-[2.5px] transition-all duration-300 outline-none group ${nameInput.trim() ? 'shadow-[0_8px_16px_-6px_rgba(205,70,47,0.5)] cursor-pointer hover:shadow-[0_12px_20px_-6px_rgba(205,70,47,0.6)] hover:scale-[1.02] active:scale-[0.98]' : 'opacity-50 grayscale cursor-not-allowed'}`}
            >
              <div className="w-full h-full bg-[#2e2e2e] group-hover:bg-[#252525] text-white rounded-full flex items-center justify-center gap-2.5 text-[14px] font-bold transition-colors">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Continue as Teacher
                    <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                  </>
                )}
              </div>
            </button>
            
            <p className="text-center text-[11px] md:text-[12px] font-medium text-gray-400 mt-4 md:mt-6 leading-relaxed max-w-[260px]">
              By continuing, you enter the workspace as an authorized educator.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
