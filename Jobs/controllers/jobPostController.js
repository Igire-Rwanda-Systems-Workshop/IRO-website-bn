import JobPostModel from "../models/jobPostModel.js";

// Create a new job post
const createJobPost = async (req, res) => {
  try {
    const newJobPost = new JobPostModel(req.body);
    await newJobPost.save();
    res.status(201).json(newJobPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all job posts
const getAllJobPosts = async (req, res) => {
  try {
    const jobPosts = await JobPostModel.find();
    res.status(200).json(jobPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single job post by ID
const getJobPostById = async (req, res) => {
  try {
    const jobPost = await JobPostModel.findById(req.params.id);
    if (!jobPost)
      return res.status(404).json({ message: "Job post not found" });
    res.status(200).json(jobPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a job post
const updateJobPost = async (req, res) => {
  try {
    const jobPost = await JobPostModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!jobPost)
      return res.status(404).json({ message: "Job post not found" });
    res.status(200).json(jobPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a job post
const deleteJobPost = async (req, res) => {
  try {
    const jobPost = await JobPostModel.findByIdAndDelete(req.params.id);
    if (!jobPost)
      return res.status(404).json({ message: "Job post not found" });
    res.status(200).json({ message: "Job post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const jobPostControllers = {
  createJobPost,
  getAllJobPosts,
  getJobPostById,
  updateJobPost,
  deleteJobPost,
};

export default jobPostControllers;
