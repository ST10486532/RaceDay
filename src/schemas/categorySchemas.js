const Joi = require('joi'); 
 
const createCategorySchema = Joi.object({ 
  categoryName: Joi.string().required().min(3).max(100), 
  distanceKm: Joi.number().required().positive().precision(2), 
  entryFee: Joi.number().optional().min(0).precision(2), 
  maxParticipants: Joi.number().optional().integer().min(1) 
}); 
 
const updateCategorySchema = Joi.object({ 
  categoryName: Joi.string().min(3).max(100), 
  distanceKm: Joi.number().positive().precision(2), 
  entryFee: Joi.number().min(0).precision(2), 
  maxParticipants: Joi.number().integer().min(1) 
}); 
 
module.exports = { createCategorySchema, updateCategorySchema }; 
