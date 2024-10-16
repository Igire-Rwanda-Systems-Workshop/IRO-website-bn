import mongoose, { Schema } from "mongoose";

const jobPostSchema = new mongoose.Schema( {
  
  jobTitle: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    minlength: 3,
    maxlength: 50,
    
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
    
  },
  
  jobDescription: {
    type: String,
    required: true,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  Deadline: {
    type: Date,
    required: true,
  },
  
  
});

const JobPost = mongoose.model("JobPost", jobPostSchema);

export default JobPost;
