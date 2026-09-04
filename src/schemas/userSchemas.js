const Joi = require('joi'); 
 
const registerSchema = Joi.object({ 
  fullName: Joi.string().required().min(3).max(100), 
  email: Joi.string().email().required(), 
  password: Joi.string().required().min(6), 
  role: Joi.string().valid('Organiser', 'Participant').required() 
}); 
 
const loginSchema = Joi.object({ 
  email: Joi.string().email().required(), 
  password: Joi.string().required() 
}); 
 
const updateProfileSchema = Joi.object({ 
  fullName: Joi.string().min(3).max(100), 
  email: Joi.string().email() 
}); 
 
module.exports = { registerSchema, loginSchema, updateProfileSchema }; 
