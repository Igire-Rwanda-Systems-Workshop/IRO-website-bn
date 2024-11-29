import Category from '../models/category.js';

export default class CategoryController {
  // Create a new category
  createCategory = async (req, res) => {
    try {
      const {categoryName} = req.body;
      const {userRole}=req;

       if(userRole !== 'Operations Manager'){
       return res.status(403).json({ message: 'Access denied. Only admins can create users.' });

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
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        { categoryName },
        { new: true, runValidators: true }
      );

      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found.' });
      }

      res.json(updatedCategory);
    } catch (error) {
      res.status(400).json({ message: error.message });
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
