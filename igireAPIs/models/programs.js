import mongoose from 'mongoose';


const ProgramPageDataSchema = new mongoose.Schema({
  bannerData: {
    title: { type: String, required: true, trim: true },
    backgroundImage: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    buttonOne: {
      backgroundImage: { type: String, required: true, trim: true }, 
      label: { type: String, required: true, trim: true },
      location: { type: String, required: true, trim: true }
    },
    buttonTwo: {
      label: { type: String, required: true, trim: true}
    }
}
});
