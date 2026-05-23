import mongoose, { Schema, Document } from 'mongoose';
import { JobState } from '@paperforge/types';

export interface IJob extends Omit<JobState, 'jobId'>, Document {
  jobId: string;
  assignmentId: mongoose.Types.ObjectId;
}

const JobSchema: Schema = new Schema({
  jobId: { type: String, required: true, unique: true },
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  status: { type: String, enum: ['QUEUED', 'GENERATING', 'COMPLETED', 'FAILED'], default: 'QUEUED' },
  progress: { type: Number, default: 0 },
  paper: { type: Schema.Types.Mixed, required: false },
  error: { type: String, required: false }
}, { timestamps: true });

export const Job = mongoose.model<IJob>('Job', JobSchema);
