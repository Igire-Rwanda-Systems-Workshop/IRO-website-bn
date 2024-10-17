import JobPostModel from "../models/jobPostModel.js";
import Applicant from "../models/ApplicantModel.js";
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
    console.log(error()
    );
    
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



// Apply to a job with file upload (resume)
const applyToJob = async (req, res) => {
  const { id } = req.params; // Job post ID
  const { FullName, email, coverLetter } = req.body; // Applicant's details
  const resume = req.file ? req.file.path : null; // Uploaded resume file

  try {
    // Check if the job post exists
    const jobPost = await JobPostModel.findById(id);

    if (!jobPost) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    // Create a new applicant
    const newApplicant = new Applicant({
      FullName,
      email,
      resume,
      coverLetter,
      jobPostId: id, // Link the applicant to the job post
    });

    // Save the applicant to the database
    await newApplicant.save();

    res.status(200).json({ message: 'Application submitted successfully', applicant: newApplicant });
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
  applyToJob
};

export default jobPostControllers;
