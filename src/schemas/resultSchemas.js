const Joi = require('joi'); 
 
const captureResultSchema = Joi.object({ 
  finishTime: Joi.string().optional(), 
  overallPosition: Joi.number().optional().integer().min(1), 
  categoryPosition: Joi.number().optional().integer().min(1), 
  status: Joi.string().valid('Finished', 'DNF', 'DQ').optional() 
}); 
 
const editResultSchema = Joi.object({ 
  finishTime: Joi.string().optional(), 
  overallPosition: Joi.number().optional().integer().min(1), 
  categoryPosition: Joi.number().optional().integer().min(1), 
  status: Joi.string().valid('Finished', 'DNF', 'DQ').required() 
}); 
 
module.exports = { captureResultSchema, editResultSchema }; 
