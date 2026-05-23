"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/ui/TopNav";
import { UploadCloud, Mic, X, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { useJobStore } from "@/store/useJobStore";

const questionTypeSchema = z.object({
  type: z.string().min(1, "Select type"),
  count: z.number().min(1),
  marks: z.number().min(1),
});

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  dueDate: z.string().min(1, "Due date is required"),
  questionTypes: z.array(questionTypeSchema).min(1, "At least one question type is required"),
  instructions: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const AVAILABLE_TYPES = [
  "Multiple Choice Questions",
  "Short Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "Essay Questions"
];

export default function CreateAssignmentPage() {
  const router = useRouter();
  const addJob = useJobStore((state) => state.addJob);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subject: "General",
      dueDate: "",
      instructions: "",
      questionTypes: [
        { type: "Multiple Choice Questions", count: 4, marks: 1 },
        { type: "Short Questions", count: 3, marks: 2 },
        { type: "Diagram/Graph-Based Questions", count: 5, marks: 5 },
        { type: "Numerical Problems", count: 5, marks: 5 },
      ]
    }
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "questionTypes",
  });

  const watchQuestionTypes = watch("questionTypes");
  const totalQuestions = watchQuestionTypes.reduce((acc, curr) => acc + (curr.count || 0), 0);
  const totalMarks = watchQuestionTypes.reduce((acc, curr) => acc + ((curr.count || 0) * (curr.marks || 0)), 0);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError("");
    try {
      const questionTypesSummary = data.questionTypes.map(q => q.type);
      const marksDistributionStr = data.questionTypes.map(q => `${q.count} ${q.type} (${q.marks} marks each)`).join(", ");

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("subject", data.subject);
      formData.append("dueDate", data.dueDate);
      formData.append("numberOfQuestions", totalQuestions.toString());
      formData.append("questionTypes", JSON.stringify(questionTypesSummary));
      formData.append("marksDistribution", marksDistributionStr);
      formData.append("instructions", data.instructions || "None");
      
      if (file) {
        formData.append("file", file);
      }

      const res = await fetch("http://localhost:3001/api/assignments/generate", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to queue generation");

      const result = await res.json();
      
      // Format current date as DD-MM-YYYY
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
      const yyyy = today.getFullYear();
      
      // Format due date from YYYY-MM-DD to DD-MM-YYYY
      const [dueY, dueM, dueD] = data.dueDate.split('-');

      addJob({
        id: result.jobId,
        title: data.title,
        subject: data.subject,
        dueDate: `${dueD}-${dueM}-${dueY}`,
        assignedOn: `${dd}-${mm}-${yyyy}`
      });
      
      router.push(`/generate/${result.jobId}`);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <>
      <TopNav breadcrumb="Assignment" showBack={true} />
      
      <div className="flex-1 w-full overflow-y-auto pb-32 pt-2 md:pt-6 px-4 md:px-0 flex flex-col items-center">
        
        {/* Desktop Header (Hidden on Mobile) */}
        <div className="hidden md:flex w-full max-w-3xl mb-8 shrink-0 px-2 items-start gap-3">
          <div className="mt-2 w-2.5 h-2.5 rounded-full bg-green-500 shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
          <div className="flex flex-col">
            <h2 className="text-[22px] font-bold text-gray-900 leading-tight">
              Create Assignment
            </h2>
            <p className="text-[13px] font-medium text-gray-400 mt-1">Set up a new assignment for your students</p>
          </div>
        </div>

        {/* Desktop Progress Bar (Hidden on Mobile) */}
        <div className="hidden md:flex gap-2 w-full max-w-3xl mb-10 shrink-0 px-2">
          <div className="w-1/2 bg-[#5E5E5E] h-[4px] rounded-full"></div>
          <div className="w-1/2 bg-[#D1D5DB] h-[4px] rounded-full"></div>
        </div>

        {/* Main Form Container */}
        <div className="bg-[#e8e8e8] w-full max-w-3xl rounded-[32px] p-5 md:p-10 flex flex-col relative shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
          
          {/* Mobile Header & Progress (Hidden on Desktop) */}
          <div className="flex md:hidden items-center justify-center relative mb-5">
            <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">Create Assignment</h2>
          </div>
          
          <div className="flex md:hidden gap-2 w-full mb-8">
            <div className="w-1/2 bg-[#5E5E5E] h-1.5 rounded-full"></div>
            <div className="w-1/2 bg-white h-1.5 rounded-full"></div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col bg-#f5f5f5">
            <div className="mb-6 md:mb-8">
              <h2 className="text-[20px] font-black text-gray-900 tracking-tight">Assignment Details</h2>
              <p className="text-[13px] text-gray-500 mt-1 font-medium">Basic information about your assignment</p>
            </div>

            {/* Assignment Name */}
            <div className="mb-6 md:mb-8">
              <label className="block text-[14px] font-bold text-gray-900 mb-3">Assignment Name</label>
              <input 
                type="text" 
                placeholder="e.g. Midterm Mathematics Exam"
                className="w-full px-5 py-3.5 md:py-4 bg-transparent border border-gray-300 rounded-full text-[14px] font-semibold text-gray-900 focus:outline-none focus:border-gray-500 placeholder:text-gray-400"
                {...register("title")}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1 font-medium pl-2">{errors.title.message}</p>}
            </div>

            {/* Upload Area */}
            <div className="border-[1.5px] border-dashed border-gray-300 rounded-[28px] p-8 md:p-12 flex flex-col items-center justify-center bg-transparent mb-3 relative group hover:border-gray-400 transition-colors">
              <input 
                type="file" 
                accept="image/jpeg, image/png, application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6 text-gray-900" />
              </div>
              {file ? (
                <div className="flex flex-col items-center relative z-20">
                  <p className="text-[13px] font-bold text-gray-900 bg-white px-4 py-2 rounded-full shadow-sm">{file.name}</p>
                  <button 
                    type="button" 
                    onClick={(e) => { e.preventDefault(); setFile(null); }} 
                    className="mt-3 px-5 py-2 text-[12px] font-bold text-red-600 bg-red-50 rounded-full hover:bg-red-100 shadow-sm"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-[14px] font-semibold text-gray-900 text-center leading-snug">Choose a file or <span className="font-black">drag & drop it here</span></p>
                  <p className="text-[11px] font-medium text-gray-400 mb-5 mt-1 text-center">JPEG, PNG, upto 10MB</p>
                  <button type="button" className="px-6 py-2.5 rounded-full text-[13px] font-bold text-gray-800 bg-white shadow-sm pointer-events-none">
                    Browse Files
                  </button>
                </>
              )}
            </div>
            <p className="text-[12px] font-medium text-gray-500 text-center mb-8 md:mb-10">Upload images of your preferred document/image</p>

            {/* Due Date */}
            <div className="mb-8 md:mb-10">
              <label className="block text-[14px] font-bold text-gray-900 mb-3">Due Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  className="w-full px-5 py-3.5 md:py-4 bg-transparent border border-gray-300 rounded-full text-[14px] font-semibold text-gray-700 focus:outline-none focus:border-gray-500"
                  {...register("dueDate")}
                />
              </div>
              {errors.dueDate && <p className="text-xs text-red-500 mt-1 font-medium pl-2">{errors.dueDate.message}</p>}
            </div>

            {/* Question Types */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <label className="text-[14px] font-bold text-gray-900">Question Type</label>
                <div className="hidden md:flex gap-16 pr-6">
                  <span className="text-[12px] font-bold text-gray-600">No. of Questions</span>
                  <span className="text-[12px] font-bold text-gray-600">Marks</span>
                </div>
              </div>

              <div className="space-y-4 md:space-y-3 mb-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="bg-white md:bg-transparent rounded-[24px] md:rounded-none p-4 md:p-0 shadow-sm md:shadow-none flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
                    
                    {/* Dropdown & X */}
                    <div className="flex items-center justify-between md:flex-1 w-full md:w-auto">
                      <div className="relative w-full md:max-w-[320px]">
                        <select 
                          className="w-full appearance-none bg-transparent md:bg-white md:rounded-full md:px-5 py-2.5 md:py-3.5 text-[13px] font-bold text-gray-900 focus:outline-none cursor-pointer pr-8 md:shadow-sm"
                          {...register(`questionTypes.${index}.type`)}
                        >
                          {AVAILABLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-1 md:right-4 flex items-center pointer-events-none">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                      </div>
                      <button type="button" onClick={() => remove(index)} className="text-gray-900 md:text-gray-500 hover:text-gray-600 p-1 md:ml-4 flex-shrink-0">
                        <X className="w-4 h-4" strokeWidth={2.5} />
                      </button>
                    </div>

                    {/* Steppers Mobile (Stacked) vs Desktop (Row) */}
                    <div className="bg-[#F8F9FA] md:bg-transparent rounded-[20px] md:rounded-none py-3 px-4 md:p-0 flex justify-between items-center md:gap-10 w-full md:w-auto mt-3 md:mt-0">
                      <div className="flex flex-col md:flex-row items-center w-1/2 md:w-auto relative after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-8 after:w-[1px] after:bg-gray-200 md:after:hidden">
                        <span className="text-[11px] font-bold text-gray-600 mb-2 md:hidden">No. of Questions</span>
                        <div className="flex items-center justify-between w-[90%] md:w-[110px] bg-white rounded-full px-2 py-1.5 md:py-2 shadow-sm">
                          <button type="button" onClick={() => update(index, { ...watchQuestionTypes[index], count: Math.max(1, watchQuestionTypes[index].count - 1) })} className="w-6 md:w-8 h-6 flex items-center justify-center text-gray-400 hover:text-gray-900 text-lg font-medium">−</button>
                          <span className="text-[13px] font-black">{watchQuestionTypes[index]?.count || 0}</span>
                          <button type="button" onClick={() => update(index, { ...watchQuestionTypes[index], count: watchQuestionTypes[index].count + 1 })} className="w-6 md:w-8 h-6 flex items-center justify-center text-gray-400 hover:text-gray-900 text-lg font-medium">+</button>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-center w-1/2 md:w-auto">
                        <span className="text-[11px] font-bold text-gray-600 mb-2 md:hidden">Marks</span>
                        <div className="flex items-center justify-between w-[90%] md:w-[110px] bg-white rounded-full px-2 py-1.5 md:py-2 shadow-sm">
                          <button type="button" onClick={() => update(index, { ...watchQuestionTypes[index], marks: Math.max(1, watchQuestionTypes[index].marks - 1) })} className="w-6 md:w-8 h-6 flex items-center justify-center text-gray-400 hover:text-gray-900 text-lg font-medium">−</button>
                          <span className="text-[13px] font-black">{watchQuestionTypes[index]?.marks || 0}</span>
                          <button type="button" onClick={() => update(index, { ...watchQuestionTypes[index], marks: watchQuestionTypes[index].marks + 1 })} className="w-6 md:w-8 h-6 flex items-center justify-center text-gray-400 hover:text-gray-900 text-lg font-medium">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                type="button" 
                onClick={() => append({ type: "Multiple Choice Questions", count: 1, marks: 1 })}
                className="flex items-center gap-3 text-[13px] font-extrabold text-gray-900 hover:text-black transition-all duration-300 ml-1 md:mt-6 group cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="w-7 h-7 rounded-full bg-[#1A1A1A] group-hover:bg-black text-white flex items-center justify-center transition-colors">
                  <Plus className="w-4 h-4" strokeWidth={3} />
                </div>
                Add Question Type
              </button>
            </div>

            <div className="flex flex-col items-end mb-8 md:mb-10 pt-2 md:pt-4 pr-2">
              <p className="text-[13px] font-bold text-gray-900">Total Questions : {totalQuestions}</p>
              <p className="text-[13px] font-bold text-gray-900 mt-1">Total Marks : {totalMarks}</p>
            </div>

            {/* Additional Information (Desktop specific) */}
            <div className="hidden md:block mb-4">
              <label className="block text-[14px] font-bold text-gray-900 mb-4">Additional Information (For better output)</label>
              <div className="relative">
                <textarea 
                  className="w-full px-5 py-5 bg-[#F4F4F5] border border-dashed border-gray-300 rounded-[28px] text-[13px] font-medium min-h-[120px] resize-none focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
                  placeholder="e.g Generate a question paper for 3 hour exam duration..."
                  {...register("instructions")}
                />
                <button type="button" className="absolute bottom-5 right-5 text-gray-900 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Bottom Actions Outside Form Container */}
        <div className="mt-8 flex justify-center items-center gap-4 w-full px-4 relative z-20">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-6 py-3.5 min-w-[140px] bg-white rounded-full text-[14px] font-bold text-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:bg-gray-50 hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          
          <button 
            type="button" 
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-8 py-3.5 min-w-[140px] bg-[#1A1A1A] text-white rounded-full text-[14px] font-bold shadow-lg hover:shadow-xl hover:bg-black transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {isLoading ? "Generating..." : "Next"}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </>
  );
}
