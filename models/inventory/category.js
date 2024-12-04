import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({

  categoryName: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model('Category', categorySchema);
export default Category;