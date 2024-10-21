import mongoose from 'mongoose';


const ProgramPageDataSchema = new mongoose.Schema({
//   bannerData: {
programs: { 
        type: String, 
        required: true, 
        trim: true 
    },
    sheCanCodeProgram: { 
        type: String,
         required: true,
         trim: true 
    },
    image1: {
      type: String,
      required: true,
      },
    paragraph1: {
        type: String, 
        required: true, 
        trim: true 
    },
    sheCanCodeGallery:{
        type: String,
        required: true,
        trim: true
    },
    image2: {
      type: String,
      required: true,
      },
    AWEPrograms:{
        type: String,
        required: true,
        trim: true
    },
    image3: {
      type: String,
      required: true,
      },
    paragraph2: {
        type: String, 
        required: true, 
        trim: true 
    },
    AWEGallery: {
      type: String,
      required: true,
      trim: true 
      },
    });
// });

const ProgramModel = mongoose.model('Programs', ProgramPageDataSchema);
export default ProgramModel;






























   