// models/contentModel.js
import mongoose from 'mongoose';

// Define the schema for content management
const contentSchema = new mongoose.Schema({
  ourStory: { type: String, required: true },
  responsibilities: { type: String, required: true },
  vision: { type: String, required: true },
  mission: { type: String, required: true },
  founders: [{
    name: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true }, // URL to the founder's image
  }],
  backgroundImage: { type: String, required: true }, // URL to the background image
  createdAt: { type: Date, default: Date.now },
});

// Create the model
const Content = mongoose.model('Content', contentSchema);

// Export the model
export default Content;
