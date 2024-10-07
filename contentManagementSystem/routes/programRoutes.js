import programController from "../controllers/ProgramController.js";
import express from "express";
const programRouter = express.Router();
import { upload } from '../../middleware/multer.js';

programRouter.post(
    '/upload',
    upload.fields([
      { name: 'backgroundImage1', maxCount: 1 },
      { name: 'backgroundImage2', maxCount: 1 },
      { name: 'backgroundImage3', maxCount: 1 }
    ]),
    programController.createProgram
  );
  programRouter.get('/getAll', programController.getAllPrograms);
  programRouter.get('/getById/:id', programController.getProgramById);
  programRouter.put('/update/:id', programController.updateProgram);
  programRouter.delete('/delete/:id', programController.deleteProgram);

  export default programRouter;
  

// Routes
