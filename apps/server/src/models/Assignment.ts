import mongoose, { Schema, Document } from 'mongoose';
import { AssignmentDocument } from '@paperforge/types';

export interface IAssignment extends Omit<AssignmentDocument, 'id'>, Document {}

const AssignmentSchema: Schema = new Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  studentClass: { type: String, required: false },
  dueDate: { type: Date, required: true },
  questionTypes: { type: [String], required: true },
  numberOfQuestions: { type: Number, required: true },
  marksDistribution: { type: String, required: true },
  instructions: { type: String, required: false },
  filePath: { type: String, required: false },
  fileMimeType: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
