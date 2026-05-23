"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { JobState, GeneratedPaper, Section, Question } from "@paperforge/types";
import { TopNav } from "@/components/ui/TopNav";
import { DownloadCloud, RefreshCw } from "lucide-react";
import { useJobStore } from "@/store/useJobStore";

const getDifficultyBadge = (diff: string) => {
  const d = diff.toLowerCase();
  if (d === 'easy') return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (d === 'medium') return "bg-amber-100 text-amber-700 border-amber-200";
  if (d === 'hard') return "bg-rose-100 text-rose-700 border-rose-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

export default function PaperOutputPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<JobState | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const recentJobs = useJobStore((state) => state.recentJobs);
  const localJob = recentJobs.find(j => j.id === jobId);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/assignments/job/${jobId}`)
      .then(res => res.json())
      .then(data => {
        setJob(data);
        setLoading(false);
      })
      .catch(console.error);
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopNav title="Create New" showBack />
        <div className="flex justify-center items-center flex-1">
          <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!job || !job.paper) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopNav title="Create New" showBack />
        <div className="text-center mt-20 text-gray-500 font-medium">
          Paper not found or generation not completed.
        </div>
      </div>
    );
  }

  const paper: GeneratedPaper = job.paper;

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('paper-container');
      const opt = {
        margin: 15,
        filename: `${paper.title || 'Assignment'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF Generation failed', error);
      // Fallback to native print if html2pdf fails
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!job) return;
    setIsRegenerating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/assignments/regenerate/${jobId}`, {
        method: "POST"
      });

      if (!res.ok) throw new Error("Failed to queue regeneration");

      const result = await res.json();

      // Update store with new job referencing the same visual details as localJob if it exists
      if (localJob) {
        addJob({
          id: result.jobId,
          title: localJob.title,
          subject: localJob.subject,
          dueDate: localJob.dueDate,
          assignedOn: localJob.assignedOn
        });
      }

      // Navigate to the loading/generating view for the new job
      router.push(`/generate/${result.jobId}`);
    } catch (error) {
      console.error("Regeneration failed", error);
      setIsRegenerating(false); // only reset on error since success navigates away
    }
  };

  return (
    <>
      <TopNav breadcrumb="Create New" showBack />

      <div className="flex-1 flex flex-col overflow-y-auto print:overflow-visible">
        <div className="bg-white md:bg-[#5e5e5e] print:bg-white max-w-full print:max-w-none rounded-[32px] print:rounded-none w-full py-2 md:py-6 print:py-0 px-2 md:px-4 print:px-0 mt-6 print:mt-0">
          {/* Dark Banner */}
          <div className="bg-[#262626] text-white rounded-[32px] p-8 mb-2 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm print:hidden gap-6">
            <p className="text-[15px] font-medium leading-relaxed max-w-2xl">
              Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:
            </p>
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="bg-[#1a1a1a] border border-[#444] text-white px-5 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-2 hover:bg-black hover:border-gray-500 transition-all duration-300 disabled:opacity-50 cursor-pointer"
              >
                {isRegenerating ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Regenerate
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="bg-white text-gray-900 px-5 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-2 hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
              >
                {isDownloading ? (
                  <div className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                ) : (
                  <DownloadCloud className="w-4 h-4" />
                )}
                {isDownloading ? "Generating..." : "Download PDF"}
              </button>
            </div>
          </div>

          {/* Paper Container */}
          <div id="paper-container" className="bg-white rounded-[32px] print:rounded-none p-10 md:p-16 print:px-16 print:py-12 shadow-sm print:shadow-none border border-gray-100 print:border-none font-sans text-gray-900 print:max-w-4xl print:mx-auto">

            <div className="text-center border-b border-gray-300 pb-8 mb-8">
              <h1 className="text-2xl font-bold mb-2">Delhi Public School, Sector-4, Bokaro</h1>
              <h2 className="text-lg font-semibold">Subject: {paper?.title || localJob?.title || "General"}</h2>
              <h3 className="text-lg font-semibold">Class: 5th</h3>

              <div className="flex justify-between items-center mt-8 text-sm font-bold px-4">
                <p>Time Allowed: 45 minutes</p>
                <p>Maximum Marks: 20</p>
              </div>
            </div>

            <div className="mb-8 text-sm font-semibold">
              <p className="mb-6 font-bold text-center md:text-left">All questions are compulsory unless stated otherwise.</p>
              <div className="space-y-4 text-sm font-bold max-w-sm">
                <div className="flex items-end gap-2">
                  <span>Name:</span>
                  <div className="flex-1 border-b border-gray-900"></div>
                </div>
                <div className="flex items-end gap-2">
                  <span>Roll Number:</span>
                  <div className="flex-1 border-b border-gray-900"></div>
                </div>
                <div className="flex items-end gap-2">
                  <span>Class: 5th &nbsp;&nbsp;&nbsp; Section:</span>
                  <div className="flex-1 border-b border-gray-900"></div>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              {paper.sections.map((section: Section, sIdx: number) => (
                <div key={sIdx} className="space-y-6">
                  <h3 className="text-center text-lg font-bold">Section {String.fromCharCode(65 + sIdx)}</h3>

                  <div className="mb-4">
                    <h4 className="font-bold text-sm">{section.title}</h4>
                    <p className="italic text-xs text-gray-600 mt-1">
                      Attempt all questions. {section.instruction || "Each question carries marks as indicated."}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {section.questions.map((q: Question, qIdx: number) => (
                      <div key={qIdx} className="flex gap-2 text-sm leading-relaxed">
                        <span className="font-bold min-w-[20px]">{qIdx + 1}.</span>
                        <div className="flex-1">
                          <p className="leading-relaxed">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-[6px] text-[10px] font-black border uppercase tracking-wider mr-2 align-middle ${getDifficultyBadge(q.difficulty)}`}>
                              {q.difficulty}
                            </span>
                            <span className="font-medium text-gray-800">{q.question}</span>
                            <span className="text-gray-500 ml-1.5 font-bold whitespace-nowrap">[{q.marks} Marks]</span>
                          </p>
                          {q.options && q.options.length > 0 && (
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-2">
                              {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className="flex gap-2">
                                  <span className="font-semibold text-gray-700">({String.fromCharCode(97 + oIdx)})</span>
                                  <span>{opt}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-20 flex flex-col items-center justify-center space-y-4 text-gray-400">
              <div className="flex items-center justify-center gap-4 w-full max-w-sm">
                <div className="h-px bg-gray-200 flex-1"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>
              <p className="text-xs font-bold tracking-widest uppercase text-gray-400">End of Question Paper</p>
            </div>

            {/* Answer Key Section */}
            <div className="mt-16 bg-[#FAFAFA] border border-gray-100 rounded-[24px] p-6 md:p-10 relative overflow-hidden group">
              {/* Decorative background element */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <h3 className="text-[18px] font-black tracking-tight text-gray-900">Answer Key</h3>
              </div>

              <div className="space-y-2 relative z-10">
                {[
                  "Electroplating is the process of depositing a thin layer of metal on the surface of another metal using electric current. Its purpose is to prevent corrosion, improve appearance, or increase thickness.",
                  "A conductor allows the flow of electric current, causing ions in the electrolyte to move and enabling chemical changes at electrodes.",
                  "Copper sulfate solution contains free copper and sulfate ions which carry electric charge, thus conducting electricity.",
                  "An example is the electroplating of silver on jewelry to prevent tarnishing.",
                  "Electric current causes the movement of ions leading to chemical changes at the electrodes, hence it shows chemical effects."
                ].map((answer, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100">
                    <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[13px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-[14px] text-gray-700 leading-relaxed font-medium mt-1">
                      {answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
