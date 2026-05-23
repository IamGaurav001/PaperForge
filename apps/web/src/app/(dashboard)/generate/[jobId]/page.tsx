"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { JobState } from "@paperforge/types";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle, BrainCircuit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

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
        <div className="flex flex-col items-center text-red-500">
          <XCircle className="w-16 h-16 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Generation Failed</h2>
          <p className="text-red-400">{error}</p>
        </div>
      );
    }

    if (status === "COMPLETED") {
      return (
        <div className="flex flex-col items-center text-green-600">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <CheckCircle2 className="w-16 h-16 mb-4" />
          </motion.div>
          <h2 className="text-2xl font-semibold">Generation Complete!</h2>
          <p className="text-green-500/80 mt-2">Redirecting to your paper...</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-20"
          />
          <BrainCircuit className="w-16 h-16 text-primary relative animate-pulse" />
        </div>
        
        <h2 className="text-2xl font-semibold mb-2">
          {status === "QUEUED" ? "Waiting in Queue..." : "AI is Generating..."}
        </h2>
        
        <p className="text-muted-foreground mb-8 text-center max-w-sm">
          {status === "QUEUED" 
            ? "Your request is securely queued and will begin processing momentarily." 
            : "Synthesizing constraints, searching knowledge base, and generating highly tailored questions."}
        </p>

        <div className="w-full max-w-md bg-secondary rounded-full h-2.5 overflow-hidden">
          <motion.div 
            className="bg-primary h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>
        <p className="text-sm font-medium text-muted-foreground mt-3">{progress}% complete</p>
      </div>
    );
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-xl border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-12">
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
