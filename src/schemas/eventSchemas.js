const Joi = require('joi'); 
 
const createEventSchema = Joi.object({ 
  eventName: Joi.string().required().min(3).max(150), 
  eventDate: Joi.date().required(), 
  location: Joi.string().required().min(3).max(150), 
  eventType: Joi.string().valid('Run', 'Walk', 'Cycle').required(), 
  description: Joi.string().max(1000).optional() 
}); 
 
const updateEventSchema = Joi.object({ 
  eventName: Joi.string().min(3).max(150), 
  eventDate: Joi.date(), 
  location: Joi.string().min(3).max(150), 
  eventType: Joi.string().valid('Run', 'Walk', 'Cycle'), 
  description: Joi.string().max(1000) 
}); 
 
module.exports = { createEventSchema, updateEventSchema }; 
