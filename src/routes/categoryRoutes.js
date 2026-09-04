const router = require('express').Router(); 
const { auth, organizerOnly } = require('../middleware/auth'); 
const { 
  getCategoriesByEvent, 
  addCategory, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/categoryController'); 
 
router.get('/events/:id/categories', getCategoriesByEvent); 
router.post('/events/:id/categories', auth, organizerOnly, addCategory); 
router.put('/categories/:id', auth, organizerOnly, updateCategory); 
router.delete('/categories/:id', auth, organizerOnly, deleteCategory); 
 
module.exports = router; 
