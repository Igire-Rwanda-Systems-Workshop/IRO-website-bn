import express from "express";
import jobPostControllers from "../controllers/jobPostController.js";
import { upload } from '../../middleware/multer.js'; 

const router = express.Router();

// Create a new job post
router.post("/create/jobs", jobPostControllers.createJobPost);

// Get all job posts
router.get("/getAll/jobs", jobPostControllers.getAllJobPosts);

// Get a specific job post by ID
router.get("/getjob/:id", jobPostControllers.getJobPostById);

// Update a job post by ID
router.put("/update/job/:id", jobPostControllers.updateJobPost);

// Delete a job post by ID
router.delete("/delete/job/:id", jobPostControllers.deleteJobPost);
router.post('/jobs/:id/apply', upload.single('resume'), jobPostControllers.applyToJob);

export default router;
