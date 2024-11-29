import express from 'express';
import CategoryController from '../controller/categoryController.js';
const router = express.Router();
const categoryController = new CategoryController();

router.post('/', categoryController.createCategory);
router.get('/getAll', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/update/:id', categoryController.updateCategory);
router.delete('/delete/:id', categoryController.deleteCategory);

export default router;
