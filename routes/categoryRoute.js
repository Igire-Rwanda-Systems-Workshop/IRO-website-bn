import express from 'express';
import CategoryController from '../controller/categoryController.js';
import authenticate from '../middleware/authmiddleware.js';
const router = express.Router();
const categoryController = new CategoryController();

router.post('/',authenticate , categoryController.createCategory);
router.get('/getAll', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/update/:id', categoryController.updateCategory);
// router.get('/product-counts', categoryController.getProductCountByCategory);
router.delete('/delete/:id', categoryController.deleteCategory);

export default router;
