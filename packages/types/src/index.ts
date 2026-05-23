export type JobStatus = 'QUEUED' | 'GENERATING' | 'COMPLETED' | 'FAILED';

export interface AssignmentFormData {
  title: string;
  subject: string;
  dueDate: string;
  questionTypes: string[];
  numberOfQuestions: number;
  marksDistribution: string;
  instructions?: string;
}

export interface Question {
  question: string;
  difficulty: string;
  marks: number;
}

export interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}

export interface GeneratedPaper {
  title: string;
  sections: Section[];
}

export interface JobState {
  jobId: string;
  status: JobStatus;
  progress: number;
  paper?: GeneratedPaper;
  error?: string;
}

export interface AssignmentDocument {
  id: string;
  title: string;
  subject: string;
  dueDate: Date;
  questionTypes: string[];
  numberOfQuestions: number;
  marksDistribution: string;
  instructions: string;
  filePath?: string;
  fileMimeType?: string;
  createdAt: Date;
}

// Socket Events
export interface ServerToClientEvents {
  jobUpdate: (jobState: JobState) => void;
}

export interface ClientToServerEvents {
  joinJob: (jobId: string) => void;
}
