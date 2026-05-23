"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { JobState, GeneratedPaper, Section, Question } from "@paperforge/types";
import { TopNav } from "@/components/ui/TopNav";
import { DownloadCloud } from "lucide-react";

export default function PaperOutputPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  
  const [job, setJob] = useState<JobState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/api/assignments/job/${jobId}`)
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <TopNav breadcrumb="Create New" showBack />

      <div className=" bg-[#5e5e5e] max-w-[1100px] rounded-[32px] w-full py-6 px-4 md:px-8 mt-8">
        {/* Dark Banner */}
        <div className="bg-[#262626] text-white rounded-[32px] p-8 mb-2 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm print:hidden gap-4">
          <p className="text-[15px] font-medium leading-relaxed max-w-3xl">
            Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:
          </p>
          <button 
            onClick={handlePrint}
            className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <DownloadCloud className="w-4 h-4" />
            Download as PDF
          </button>
        </div>

        {/* Paper Container */}
        <div className="bg-white rounded-[32px] p-10 md:p-16 shadow-sm border border-gray-100 font-sans text-gray-900">
          
          <div className="text-center border-b border-gray-300 pb-8 mb-8">
            <h1 className="text-2xl font-bold mb-2">Delhi Public School, Sector-4, Bokaro</h1>
            <h2 className="text-lg font-semibold">Subject: {paper.title || "General"}</h2>
            <h3 className="text-lg font-semibold">Class: 5th</h3>
            
            <div className="flex justify-between items-center mt-8 text-sm font-bold">
              <p>Time Allowed: 45 minutes</p>
              <p>Maximum Marks: 20</p>
            </div>
          </div>

          <div className="mb-8 text-sm font-semibold">
            <p className="mb-6 font-bold">All questions are compulsory unless stated otherwise.</p>
            <div className="space-y-1 text-sm font-bold">
              <div className="flex">
                <span className="w-16">Name:</span>
                <span>______________________</span>
              </div>
              <div className="flex">
                <span className="w-24">Roll Number:</span>
                <span>______________________</span>
              </div>
              <div className="flex">
                <span className="w-32">Class: 5th Section:</span>
                <span>_________________</span>
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
                      <p className="flex-1">
                        <span className="text-gray-500 mr-1">[{q.difficulty}]</span>
                        {q.question} 
                        <span className="text-gray-500 ml-1">[{q.marks} Marks]</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-sm font-bold pb-12 border-b border-gray-300">
            End of Question Paper
          </div>

          {/* Answer Key Stub (If AI provides it, we could render it. Here we add a placeholder based on design) */}
          <div className="mt-8">
            <h3 className="text-[15px] font-bold mb-4">Answer Key:</h3>
            <ol className="list-decimal pl-5 space-y-4 text-sm text-gray-700 leading-relaxed">
              <li>Electroplating is the process of depositing a thin layer of metal on the surface of another metal using electric current. Its purpose is to prevent corrosion, improve appearance, or increase thickness.</li>
              <li>A conductor allows the flow of electric current, causing ions in the electrolyte to move and enabling chemical changes at electrodes.</li>
              <li>Copper sulfate solution contains free copper and sulfate ions which carry electric charge, thus conducting electricity.</li>
              <li>An example is the electroplating of silver on jewelry to prevent tarnishing.</li>
              <li>Electric current causes the movement of ions leading to chemical changes at the electrodes, hence it shows chemical effects.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
