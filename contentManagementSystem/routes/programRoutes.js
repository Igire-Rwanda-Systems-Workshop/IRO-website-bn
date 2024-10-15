import programController from "../controllers/ProgramController.js";
import express from "express";
const programRouter = express.Router();
// import { upload } from '../../middleware/multer.js';

  programRouter.post('/create', programController.createProgram);
  programRouter.get('/getAll', programController.getAllPrograms);
  programRouter.get('/getById/:id', programController.getProgramById);
  programRouter.put('/update/:id', programController.updateProgram);
  programRouter.delete('/delete/:id', programController.deleteProgram);

  export default programRouter;
  

// Routes
