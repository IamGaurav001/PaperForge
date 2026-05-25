import { Router } from 'express';
import { Assignment } from '../models/Assignment.js';
import { Job } from '../models/Job.js';
import { assessmentQueue } from '../queue/index.js';
import { v4 as uuidv4 } from 'uuid';

import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })

const router = Router();

router.post('/generate', upload.single('file'), async (req, res) => {
  try {
    let { title, subject, studentClass, dueDate, questionTypes, numberOfQuestions, marksDistribution, instructions } = req.body;
    
    // Parse JSON strings back to objects/arrays if they come from FormData
    if (typeof questionTypes === 'string') {
      try { questionTypes = JSON.parse(questionTypes); } catch(e) {}
    }

    const file = req.file;

    // 1. Save Assignment
    const assignment = new Assignment({
      title,
      subject,
      studentClass,
      dueDate,
      questionTypes,
      numberOfQuestions,
      marksDistribution,
      instructions,
      filePath: file ? file.path : undefined,
      fileMimeType: file ? file.mimetype : undefined
    });
    await assignment.save();

    // 2. Create Job
    const jobId = uuidv4();
    const job = new Job({
      jobId,
      assignmentId: assignment._id,
      status: 'QUEUED',
      progress: 0
    });
    await job.save();

    // 3. Add to BullMQ
    await assessmentQueue.add('generate', { jobId, assignmentId: assignment._id });

    // 4. Return jobId to client
    res.status(202).json({ jobId, message: 'Generation queued' });
  } catch (error) {
    console.error('Error in /generate:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/job/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findOne({ jobId });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/regenerate/:jobId', async (req, res) => {
  try {
    const { jobId: oldJobId } = req.params;
    
    // Find the original job to get the assignmentId
    const oldJob = await Job.findOne({ jobId: oldJobId });
    if (!oldJob) {
      return res.status(404).json({ error: 'Original job not found' });
    }

    const assignment = await Assignment.findById(oldJob.assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Original assignment not found' });
    }

    // Create a new Job for the same assignment
    const newJobId = uuidv4();
    const newJob = new Job({
      jobId: newJobId,
      assignmentId: assignment._id,
      status: 'QUEUED',
      progress: 0
    });
    await newJob.save();

    // Add to BullMQ
    await assessmentQueue.add('generate', { jobId: newJobId, assignmentId: assignment._id });

    // Return the new jobId to client
    res.status(202).json({ jobId: newJobId, message: 'Regeneration queued' });
  } catch (error) {
    console.error('Error in /regenerate:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
