import express from "express";
import jobPostControllers from "../controllers/jobPostController.js";

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

export default router;
