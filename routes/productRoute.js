import express from 'express';
import ProductController from '../controller/productCtroller.js';
import checkRole from '../middleware/permission.js'; // Middleware for role checking
import authenticate from '../middleware/authmiddleware.js';


const productRouter = express.Router();
const productController = new ProductController();

// Create product
productRouter.post('/create-product', productController.createProduct);
productRouter.get('/products-by-category/:categoryId', productController.getProductsByCategoryId);
productRouter.get('/getAll', productController.getAllProducts);
productRouter.get('/getById/:id', productController.getProductById);
productRouter.put('/updateStatus/:id', productController.updateProductStatusCondition)
productRouter.get('/products/category/:categoryId', productController.getProductsByCategoryId);
productRouter.put('/update/:id', productController.updateProduct);
productRouter.get('/product-status', productController.getProductStatusByMonth);

productRouter.delete('/:id', productController.deleteProduct);
export default productRouter;
