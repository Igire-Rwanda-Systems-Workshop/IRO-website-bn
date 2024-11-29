import productPaths from '../Docs/Product/product.js';
import users from './User/user.js';
import categoryPaths from './Category/category.js';

export const allPaths = {
  ...users,
  ...categoryPaths,
  ...productPaths
};

