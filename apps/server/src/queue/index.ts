import { Queue, Worker, Job as BullJob } from 'bullmq';
import { Job } from '../models/Job.js';
import { Assignment } from '../models/Assignment.js';
import { generateAssessment } from '../services/ai.js';
import { io } from '../index.js';
import { AssignmentDocument } from '@paperforge/types';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const assessmentQueue = new Queue('assessmentQueue', { connection });

const worker = new Worker('assessmentQueue', async (bullJob: BullJob) => {
  const { jobId, assignmentId } = bullJob.data;

  try {
    // Update status to GENERATING
    await Job.findOneAndUpdate({ jobId }, { status: 'GENERATING' });
    io.emit('jobUpdate', { jobId, status: 'GENERATING', progress: 10 });

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw new Error('Assignment not found');

    // Artificial progress updates
    let progress = 10;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15);
      if (progress > 90) progress = 90;
      io.emit('jobUpdate', { jobId, status: 'GENERATING', progress });
    }, 2000);

    // Call OpenAI
    const generatedPaper = await generateAssessment(assignment as unknown as AssignmentDocument);
    
    clearInterval(interval);

    // Save and complete
    await Job.findOneAndUpdate({ jobId }, { status: 'COMPLETED', paper: generatedPaper, progress: 100 });
    io.emit('jobUpdate', { jobId, status: 'COMPLETED', progress: 100, paper: generatedPaper });

  } catch (error: any) {
    console.error(`Job ${jobId} failed:`, error);
    await Job.findOneAndUpdate({ jobId }, { status: 'FAILED', error: error.message, progress: 0 });
    io.emit('jobUpdate', { jobId, status: 'FAILED', progress: 0, error: error.message });
    throw error;
  }
}, { connection });

worker.on('failed', (job, err) => {
  console.error(`${job?.id} has failed with ${err.message}`);
});
