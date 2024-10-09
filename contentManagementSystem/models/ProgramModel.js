import mongoose from 'mongoose';


const ProgramPageDataSchema = new mongoose.Schema({
//   bannerData: {
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    subTitle1: { 
        type: String,
         required: true,
         trim: true 
    },
    backgroundImage1: {
        filename: String, 
        path: String, 
        mimetype: String, 
        size: Number 
      },
    paragraph1: {
        type: String, 
        required: true, 
        trim: true 
    },
    subTitle2:{
        type: String,
        required: true,
        trim: true
    },
    backgroundImage2: {
        filename: String, 
        path: String, 
        mimetype: String, 
        size: Number 
      },
    subTitle3:{
        type: String,
        required: true,
        trim: true
    },
    paragraph2: {
        type: String, 
        required: true, 
        trim: true 
    },
    subTitle4:{
        type: String,
        required: true,
        trim: true
    },
    backgroundImage3: {
        filename: String, 
        path: String, 
        mimetype: String, 
        size: Number 
      },
    });
// });

const ProgramModel = mongoose.model('Programs', ProgramPageDataSchema);
export default ProgramModel;






























   