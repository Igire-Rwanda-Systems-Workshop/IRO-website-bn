import express from 'express';
import { CategoryController } from '../../controllers/inventory/categoryController';

const categoryRouter = express.Router();
const categoryController = new CategoryController();

categoryRouter.post('/', categoryController.createCategory);
categoryRouter.get('/getAll', categoryController.getAllCategories);
categoryRouter.get('/:id', categoryController.getCategoryById);
categoryRouter.put('/update/:id', categoryController.updateCategory);
categoryRouter.delete('/delete/:id', categoryController.deleteCategory);

export default categoryRouter;
