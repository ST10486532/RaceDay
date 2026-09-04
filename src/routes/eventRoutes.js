const router = require('express').Router(); 
const { auth, organizerOnly } = require('../middleware/auth'); 
const { 
  getAllEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} = require('../controllers/eventController'); 
 
router.get('/', getAllEvents); 
router.get('/:id', getEventById); 
router.post('/', auth, organizerOnly, createEvent); 
router.put('/:id', auth, organizerOnly, updateEvent); 
router.delete('/:id', auth, organizerOnly, deleteEvent); 
 
module.exports = router; 
