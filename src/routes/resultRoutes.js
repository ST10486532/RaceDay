const router = require('express').Router(); 
const { auth, organizerOnly, participantOnly } = require('../middleware/auth'); 
const { 
  captureResult, 
  editResult, 
  getUserResults, 
  getEventResults 
} = require('../controllers/resultController'); 
 
router.post('/enrolments/:id/result', auth, organizerOnly, captureResult); 
router.put('/results/:id', auth, organizerOnly, editResult); 
router.get('/users/me/results', auth, participantOnly, getUserResults); 
router.get('/events/:id/results', getEventResults); 
 
module.exports = router; 
