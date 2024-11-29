import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


// Define Product schema
const productSchema = new mongoose.Schema({
  prod_id: { type: String, required: true, unique: true},
  name: { type: String, required: true },
  brand: { type: String, required: true },
  dimensions: { type: String },
  location: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  status: { type: String, enum: ['available','stolen','damaged'], default: 'available' },
  condition: { type: String, enum: ['new', 'used','damaged'], required: true },
  dateOfEntry: { type: Date, default: Date.now },
  productImage: { type: String }, 
  borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
});

const Product = mongoose.model('Product', productSchema);
export default Product;

