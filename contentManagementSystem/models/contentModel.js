import mongoose from 'mongoose';

const contentsSchema = new mongoose.Schema({
  ourStory: {
    title: String,
    description: String,
    backgroundImage: String 
  },
  responsibilities: [
    {
      title: String,
      content: String
    }
  ],
  vision: {
    title: String,    
    content: String,  
    icon: String      
  },
  mission: {
    title: String,   
    content: String, 
    icon: String      
  },
  founders: [
    {
      name: String,
      role: String,
      image: String 
    }
  ],
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const contents = mongoose.model('contents', contentsSchema);

export default contents;
