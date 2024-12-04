import Category from '../models/category.js';
import { mongoose } from "mongoose";

export default class CategoryController {
  // Create a new category
  createCategory = async (req, res) => {
    try {
      const {categoryName} = req.body;
      // const {userRole}=req;
      const { role:userRole, id: userId } = req.user;
      console.log(userRole);
      console.log("User is an Operations Manager", userRole);
      console.log("idddd",userId);

       if(userRole !== 'Operations Manager'){
       return res.status(403).json({ message: 'Access denied.' });

       }

      // Validate input
      if (!categoryName ) {
        return res.status(400).json({ message: 'CategoryName is required.' });
      }

      const category = new Category({ categoryName });
      const savedCategory = await category.save();
      res.status(201).json({
        "message": 'Category added successfully',
        data:savedCategory
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // Get all categories
  getAllCategories = async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Get a single category by ID
  getCategoryById = async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Update a category by ID
  updateCategory = async (req, res) => {
    try {
      const { categoryName } = req.body;
      
      // Validation checks
      if (!categoryName || categoryName.trim() === '') {
        return res.status(400).json({ 
          message: 'Category name is required and cannot be empty.' 
        });
      }
  
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ 
          message: 'Invalid category ID format.' 
        });
      }
  
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        { categoryName: categoryName.trim() }, // Trim whitespace
        { 
          new: true,        // Return the modified document
          runValidators: true, // Run model validation
          context: 'query'  // Ensures mongoose runs validation in update context
        }
      );
  
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found.' });
      }
  
      res.status(200).json({
        message: 'Category updated successfully',
        data: updatedCategory
      });
  
    } catch (error) {
      // More detailed error handling
      console.error('Update Category Error:', error);
  
      // Handle specific mongoose validation errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          message: 'Validation Error',
          errors: Object.values(error.errors).map(err => err.message)
        });
      }
  
      // Handle duplicate key errors
      if (error.code === 11000) {
        return res.status(409).json({
          message: 'A category with this name already exists.',
          duplicateField: Object.keys(error.keyPattern)[0]
        });
      }
  
      // Generic server error
      res.status(500).json({ 
        message: 'Internal server error', 
        error: error.message 
      });
    }
  };

  // Delete a category by ID
  deleteCategory = async (req, res) => {
    try {
      const deletedCategory = await Category.findByIdAndDelete(req.params.id);
      if (!deletedCategory) {
        return res.status(404).json({ message: 'Category not found.' });
      }

      res.json({ message: 'Category deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
