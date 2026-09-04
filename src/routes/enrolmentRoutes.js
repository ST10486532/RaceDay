const router = require('express').Router(); 
const { auth, organizerOnly, participantOnly } = require('../middleware/auth'); 
const { 
  enrolInCategory, 
  getUserEnrolments, 
  cancelEnrolment, 
  getEventEnrolments 
} = require('../controllers/enrolmentController'); 
 
router.post('/categories/:id/enrol', auth, participantOnly, enrolInCategory); 
router.get('/users/me/enrolments', auth, participantOnly, getUserEnrolments); 
router.delete('/enrolments/:id', auth, participantOnly, cancelEnrolment); 
router.get('/events/:id/enrolments', auth, organizerOnly, getEventEnrolments); 
 
module.exports = router; 
