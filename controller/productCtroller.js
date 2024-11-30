import Product from '../models/product.js';
import Category from '../models/category.js';
import mongoose from 'mongoose';
import moment from 'moment';


export default class ProductController {
  
  // Create a new product
   createProduct = async (req, res) => {
  
    try {
      // Check if user is an Operations Manager
      const { role:userRole, id: userId } = req.user;
      console.log("User is an Operations Manager", userRole);
      console.log("idddd",userId);
      
      
      
      // Strict role validation
      if (userRole !== 'Operations Manager') {
        return res.status(403).json({ 
          message: 'Access denied. Only Operations Managers can create products.' 
        });
      }
  
      // Destructure request body
      const {
        prod_id,
        name,
        brand,
        dimensions,
        categoryId,
        location,
        status,
        condition,
        productImage,
      } = req.body;
  
      // Comprehensive validation of required fields
      const requiredFields = ['prod_id', 'name', 'brand', 'categoryId', 'condition'];
      for (let field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ 
            message: `${field} is required to create a product.` 
          });
        }
      }
  
      // Verify category exists and is valid
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ 
          message: 'Invalid category. Please provide a valid category ID.' 
        });
      }
  
      // Check if product ID is unique
      const existingProduct = await Product.findOne({ prod_id });
      if (existingProduct) {
        return res.status(409).json({ 
          message: 'A product with this ID already exists.' 
        });
      }
  
      // Create new product
      const product = new Product({
        prod_id,
        name,
        brand,
        dimensions,
        categoryId,
        location,
        status: status || 'available',
        condition,
        productImage,
        createdBy: userId 
      });
  
      // Save product
      const savedProduct = await product.save();
  
      res.status(201).json({
        message: 'Product created successfully in the specified category.',
        data: savedProduct
      });
  
    } catch (error) {
      console.error('Product creation error:', error);
      res.status(500).json({ 
        message: 'Failed to create product', 
        error: error.message 
      });
    }
  };
  
  // Get all products
  getAllProducts = async (req, res) => {
    try {
      const products = await Product.find()
        .populate('categoryId', 'categoryName'); 

      res.status(200).json({
        message: 'Products retrieved successfully',
        data: products,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve products', error: error.message });
    }
  };

  // Get a single product by ID
  getProductById = async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product ID format.' });
      }

      const product = await Product.findById(id)
        .populate('categoryId', 'categoryName');

      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      res.status(200).json({
        message: 'Product retrieved successfully',
        data: product,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve product', error: error.message });
    }
  };

  // Get products by category ID
  getProductsByCategoryId = async (req, res) => {
    try {
      const { categoryId } = req.params;
      
      
  
      // Validate categoryId
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: 'Invalid categoryId format. Please provide a valid ObjectId.' });
      }
  
      // Check if category exists
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
      }
  
      // Fetch products with populated category details
      const products = await Product.find({ categoryId }).populate('categoryId', 'categoryName');
  
      res.status(200).json({
        message: 'Products retrieved successfully',
        data: products,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  };

  // Update a product
  updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product ID format.' });
      }

      // If categoryId is being updated, validate it exists
      if (updateData.categoryId) {
        const category = await Category.findById(updateData.categoryId);
        if (!category) {
          return res.status(404).json({ message: 'Invalid categoryId. No such category exists.' });
        }
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      res.status(200).json({
        message: 'Product updated successfully',
        data: updatedProduct,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
  };
  
  
  getProductStatusByMonth = async (req, res) => {
    try {
      // Default to current year and month if not provided
      const year = parseInt(req.query.year) || new Date().getFullYear();
      const month = parseInt(req.query.month) || new Date().getMonth() + 1;
  
      // Create start and end dates for the entire month
      const startOfMonth = moment(`${year}-${month}`, "YYYY-MM").startOf('month').toDate();
      const endOfMonth = moment(`${year}-${month}`, "YYYY-MM").endOf('month').toDate();
  
      // Aggregate status for the entire month
      const statusAggregation = await Product.aggregate([
        {
          $match: {
            dateOfEntry: {
              $gte: startOfMonth,
              $lte: endOfMonth
            },
            // Only consider damaged and stolen statuses
            status: { $in: ['stolen', 'damaged'] }
            
          }
        },
        {
          $group: {
            _id: {
              day: { $dayOfMonth: '$dateOfEntry' },
              status: '$status'
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.day': 1 }
        }
      ]);
  
      // Prepare daily status array with all days of the month
      const daysInMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
      
      // Prepare data for Chart.js
      const chartData = {
        labels: Array.from({length: daysInMonth}, (_, i) => i + 1), // Days 1 to daysInMonth
        datasets: [
          {
            label: 'Stolen Items',
            data: new Array(daysInMonth).fill(0).map((_, dayIndex) => {
              const matchingData = statusAggregation.find(
                item => item._id.day === dayIndex + 1 && item._id.status === 'stolen'
              );
              return matchingData ? matchingData.count : 0;
            }),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Damaged Items',
            data: new Array(daysInMonth).fill(0).map((_, dayIndex) => {
              const matchingData = statusAggregation.find(
                item => item._id.day === dayIndex + 1 && item._id.status === 'damaged'
              );
              return matchingData ? matchingData.count : 0;
            }),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          }
        ]
      };
  
      res.json({
        message: 'Product status retrieved successfully',
        data: chartData
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error retrieving product status',
        error: error.message
      });
    }
  };

  // Delete a product
  deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product ID format.' });
      }

      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      res.status(200).json({
        message: 'Product deleted successfully',
        data: deletedProduct,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete product', error: error.message });
    }
  };

  updateProductStatusCondition = async (req, res) => {
    try {
      console.log("jkkjkjre", req.params);
      
      // Check if user is an Operations Manager
      const { role: userRole } = req.user;
      console.log("User role:", userRole);
  
      // Strict role validation
      if (userRole !== 'Operations Manager') {
        return res.status(403).json({ 
          message: 'Access denied. Only Operations Managers can update product details.' 
        });
      }
  
      // Get product ID from request params
      const { id } = req.params;
      
      
  
      // Get status and condition from request body
      const { status, condition } = req.body;
  
      // Ensure at least one field is provided
      if (!status && !condition) {
        return res.status(400).json({ 
          message: 'At least one of "status" or "condition" must be provided for updating.' 
        });
      }
  
      // Validate status and condition values if provided
      const validStatuses = ['damaged', 'borrowed', 'stolen'];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: `Invalid status value. Allowed values are: ${validStatuses.join(', ')}` 
        });
      }
  
      const validConditions = ['new', 'used', 'damaged'];
      if (condition && !validConditions.includes(condition)) {
        return res.status(400).json({ 
          message: `Invalid condition value. Allowed values are: ${validConditions.join(', ')}` 
        });
      }
  
      // Find product by prod_id
      const product = await Product.findOne({ prod_id: id });
      
      if (!product) {
        return res.status(404).json({ 
          message: 'Product not found. Please provide a valid product ID.' 
        });
      }
  
      // Update fields if provided
      if (status) product.status = status;
      if (condition) product.condition = condition;
  
      // Save updated product
      const updatedProduct = await product.save();
  
      res.status(200).json({
        message: 'Product status and/or condition updated successfully.',
        data: updatedProduct
      });
  
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ 
        message: 'Failed to update product status and/or condition', 
        error: error.message 
      });
    }
  };
  
}

