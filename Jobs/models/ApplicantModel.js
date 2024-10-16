import mongoose, { Schema } from 'mongoose';

// Define the Applicant schema
const applicantSchema = new mongoose.Schema({
  FullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  resume: {
    type: String,
    required: true, 
  },
  coverLetter: {
    type: String,
    trim: true,
    
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  jobPostId: {
    type: Schema.Types.ObjectId,
    ref: 'JobPost',
    required: true, 
  },
});

// Create the Applicant model
const Applicant = mongoose.model('Applicant', applicantSchema);

export default Applicant;
