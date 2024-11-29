import express from 'express';
import ProductController from '../controller/productCtroller.js';
import checkRole from '../middleware/permission.js'; // Middleware for role checking
import authenticate from '../middleware/authmiddleware.js';


const productRouter = express.Router();
const productController = new ProductController();

// Create product
productRouter.post('/create-product',authenticate , productController.createProduct);
productRouter.get('/products-by-category/:categoryId', productController.getProductsByCategoryId);
productRouter.get('/getAll',authenticate , productController.getAllProducts);
productRouter.get('/getById/:id',authenticate, productController.getProductById);
productRouter.put('/updateStatus/:id',authenticate, productController.updateProductStatusCondition)
productRouter.get('/products/category/:categoryId',authenticate, productController.getProductsByCategoryId);
productRouter.put('/update/:id',authenticate, productController.updateProduct);
productRouter.get('/product-status', productController.getProductStatusByMonth);

productRouter.delete('/:id',authenticate, productController.deleteProduct);
export default productRouter;
