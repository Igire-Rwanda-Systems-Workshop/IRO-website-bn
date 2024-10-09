import mongoose from 'mongoose';


const ProgramPageDataSchema = new mongoose.Schema({
//   bannerData: {
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    sheCanCodeProgram: { 
        type: String,
         required: true,
         trim: true 
    },
    sheCanCodeImage: {
        filename: String, 
        path: String, 
        mimetype: String, 
        size: Number 
      },
    sheCanCodeParagraph: {
        type: String, 
        required: true, 
        trim: true 
    },
    sheCanCodeGallery:{
        type: String,
        required: true,
        trim: true
    },
    GalleryImage: {
        filename: String, 
        path: String, 
        mimetype: String, 
        size: Number 
      },
      AWEProgram:{
        type: String,
        required: true,
        trim: true
    },
    AWEProgramImage: {
        filename: String, 
        path: String, 
        mimetype: String, 
        size: Number  
    },
    AWEProgramParagraph: {
        type: String, 
        required: true, 
        trim: true 
    },
    AWEGalleryImage:{
        filename: String, 
        path: String, 
        mimetype: String, 
        size: Number 
    },
    });
// });

const ProgramModel = mongoose.model('Programs', ProgramPageDataSchema);
export default ProgramModel;






























   