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
      title: "New Assignment",
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
      addJob(result.jobId);
      router.push(`/generate/${result.jobId}`);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <>
      <TopNav breadcrumb="Assignment" showBack />
      
      <div className="flex-1 w-full overflow-y-auto pb-32">
        <div className="max-w-3xl mx-auto w-full pt-4">
          <div className="mb-8 shrink-0 px-2 flex items-start gap-3">
            <div className="mt-2 w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
            <div className="flex flex-col">
              <h2 className="text-[20px] font-bold text-gray-900 leading-tight">
                Create Assignment
              </h2>
              <p className="text-[12px] text-gray-400 mt-0.5">Set up a new assignment for your students</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-4 w-full mb-8 shrink-0 px-2">
            <div className="flex-1 bg-gray-600 h-1 rounded-full"></div>
            <div className="flex-1 bg-gray-200 h-1 rounded-full"></div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="bg-[#f5f5f5] rounded-[32px] p-8 lg:p-10 shadow-sm border border-gray-100">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900">Assignment Details</h2>
            <p className="text-[13px] text-gray-500 mt-1">Basic information about your assignment</p>
          </div>

          {/* Upload Area */}
          <div className="border border-dashed border-gray-300 rounded-[24px] p-8 flex flex-col items-center justify-center bg-white mb-2 relative shadow-sm">
            <input 
              type="file" 
              accept="image/jpeg, image/png, application/pdf"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFile(e.target.files[0]);
                }
              }}
            />
            <UploadCloud className="w-6 h-6 text-gray-800 mb-3" />
            {file ? (
              <div className="flex flex-col items-center z-10">
                <p className="text-[13px] font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-full border shadow-sm">{file.name}</p>
                <button 
                  type="button" 
                  onClick={(e) => { e.preventDefault(); setFile(null); }} 
                  className="mt-3 px-4 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-full hover:bg-red-100 relative z-20"
                >
                  Remove File
                </button>
              </div>
            ) : (
              <>
                <p className="text-[13px] font-bold text-gray-900 pointer-events-none">Choose a file or drag & drop it here</p>
                <p className="text-[11px] text-gray-400 mb-4 mt-1 pointer-events-none">JPEG, PNG, upto 10MB</p>
                <button type="button" className="px-5 py-2 rounded-full text-[13px] font-bold text-gray-700 bg-gray-100 pointer-events-none">
                  Browse Files
                </button>
              </>
            )}
          </div>
          <p className="text-[12px] text-gray-500 text-center mb-8">Upload images of your preferred document/image</p>

          {/* Due Date */}
          <div className="mb-8">
            <label className="block text-[13px] font-bold text-gray-900 mb-2">Due Date</label>
            <input 
              type="date" 
              className="w-full px-4 py-3 bg-transparent border border-gray-200 rounded-full text-[13px] font-medium text-gray-700 focus:outline-none focus:border-gray-300"
              {...register("dueDate")}
            />
            {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate.message}</p>}
          </div>

          {/* Question Types */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4 px-1">
              <label className="text-[13px] font-bold text-gray-900">Question Type</label>
              <div className="flex gap-14 pr-2">
                <span className="text-[12px] font-bold text-gray-900">No. of Questions</span>
                <span className="text-[12px] font-bold text-gray-900">Marks</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <select 
                      className="w-full appearance-none px-4 py-3 bg-white rounded-full text-[13px] font-semibold text-gray-700 focus:outline-none shadow-sm"
                      {...register(`questionTypes.${index}.type`)}
                    >
                      {AVAILABLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  <button type="button" onClick={() => remove(index)} className="text-gray-500 hover:text-gray-800 p-1 font-bold">
                    <X className="w-3 h-3" strokeWidth={3} />
                  </button>

                  <div className="flex items-center gap-4">
                    {/* Count Stepper */}
                    <div className="flex items-center bg-white rounded-full px-3 py-1.5 shadow-sm">
                      <button type="button" onClick={() => update(index, { ...watchQuestionTypes[index], count: Math.max(1, watchQuestionTypes[index].count - 1) })} className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-900 text-lg font-medium">−</button>
                      <span className="w-8 text-center text-[13px] font-bold">{watchQuestionTypes[index]?.count || 0}</span>
                      <button type="button" onClick={() => update(index, { ...watchQuestionTypes[index], count: watchQuestionTypes[index].count + 1 })} className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-900 text-lg font-medium">+</button>
                    </div>

                    {/* Marks Stepper */}
                    <div className="flex items-center bg-white rounded-full px-3 py-1.5 shadow-sm">
                      <button type="button" onClick={() => update(index, { ...watchQuestionTypes[index], marks: Math.max(1, watchQuestionTypes[index].marks - 1) })} className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-900 text-lg font-medium">−</button>
                      <span className="w-8 text-center text-[13px] font-bold">{watchQuestionTypes[index]?.marks || 0}</span>
                      <button type="button" onClick={() => update(index, { ...watchQuestionTypes[index], marks: watchQuestionTypes[index].marks + 1 })} className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-900 text-lg font-medium">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="button" 
              onClick={() => append({ type: "Multiple Choice Questions", count: 1, marks: 1 })}
              className="flex items-center gap-2 text-[12px] font-bold text-gray-900 hover:opacity-80 transition-opacity"
            >
              <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              Add Question Type
            </button>
          </div>

          <div className="flex flex-col items-end mb-8 pt-2">
            <p className="text-[13px] font-bold text-gray-900">Total Questions : {totalQuestions}</p>
            <p className="text-[13px] font-bold text-gray-900 mt-1">Total Marks : {totalMarks}</p>
          </div>

          {/* Additional Information */}
          <div className="mb-4">
            <label className="block text-[13px] font-bold text-gray-900 mb-2">Additional Information (For better output)</label>
            <div className="relative">
              <textarea 
                className="w-full px-4 py-4 bg-transparent border border-dashed border-gray-300 rounded-[24px] text-[13px] min-h-[100px] resize-none focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
                {...register("instructions")}
              />
              <button type="button" className="absolute bottom-4 right-4 text-gray-800 p-1 hover:text-black">
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hidden fields removed as they are now handled by defaultValues */}
        </form>

        {/* Bottom Actions */}
        <div className="py-6 flex justify-between items-center">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          
          <button 
            type="button" 
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-full text-sm font-bold shadow-lg hover:bg-black transition-colors"
          >
            {isLoading ? "Generating..." : "Next"}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
        </div>
      </div>
    </>
  );
}
