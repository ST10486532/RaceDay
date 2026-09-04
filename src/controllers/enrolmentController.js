const { getConnection, sql } = require('../config/database'); 
 
const enrolInCategory = async (req, res) => { 
  try { 
    const pool = await getConnection(); 
    const categoryId = req.params.id; 
    const categoryCheck = await pool.request() 
      .input('categoryId', sql.Int, categoryId) 
      .query(`SELECT CategoryID, MaxParticipants, 
              (SELECT COUNT(*) FROM Enrolments WHERE CategoryID = @categoryId AND Status = 'Confirmed') as EnrolledCount 
              FROM Categories WHERE CategoryID = @categoryId`); 
    if (categoryCheck.recordset.length === 0) { 
      return res.status(404).json({ error: 'Category not found' }); 
    } 
    const { MaxParticipants, EnrolledCount } = categoryCheck.recordset[0]; 
    if (EnrolledCount  { 
      return res.status(409).json({ error: 'Category is full' }); 
    } 
    const existing = await pool.request() 
      .input('participantId', sql.Int, req.userId) 
      .input('categoryId', sql.Int, categoryId) 
      .query('SELECT EnrolmentID FROM Enrolments WHERE ParticipantID = @participantId AND CategoryID = @categoryId'); 
    if (existing.recordset.length  { 
      return res.status(409).json({ error: 'Already enrolled in this category' }); 
    } 
    const result = await pool.request() 
      .input('participantId', sql.Int, req.userId) 
      .input('categoryId', sql.Int, categoryId) 
      .query(`INSERT INTO Enrolments (ParticipantID, CategoryID) 
              OUTPUT INSERTED.* 
              VALUES (@participantId, @categoryId)`); 
    res.status(201).json(result.recordset[0]); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 
 
const getUserEnrolments = async (req, res) => { 
  try { 
    const pool = await getConnection(); 
    const result = await pool.request() 
      .input('participantId', sql.Int, req.userId) 
      .query(`SELECT e.*, c.CategoryName, c.DistanceKm, ev.EventName, ev.EventDate 
              FROM Enrolments e 
              JOIN Categories c ON e.CategoryID = c.CategoryID 
              JOIN Events ev ON c.EventID = ev.EventID 
              WHERE e.ParticipantID = @participantId`); 
    res.json(result.recordset); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 
 
const cancelEnrolment = async (req, res) => { 
  try { 
    const pool = await getConnection(); 
    const check = await pool.request() 
      .input('enrolmentId', sql.Int, req.params.id) 
      .input('participantId', sql.Int, req.userId) 
      .query('SELECT EnrolmentID FROM Enrolments WHERE EnrolmentID = @enrolmentId AND ParticipantID = @participantId'); 
    if (check.recordset.length === 0) { 
      return res.status(403).json({ error: 'Not the owner or enrolment not found' }); 
    } 
    await pool.request() 
      .input('enrolmentId', sql.Int, req.params.id) 
      .query("UPDATE Enrolments SET Status = 'Cancelled' WHERE EnrolmentID = @enrolmentId"); 
    res.json({ message: 'Enrolment cancelled successfully' }); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 
 
const getEventEnrolments = async (req, res) => { 
  try { 
    const pool = await getConnection(); 
    const result = await pool.request() 
      .input('eventId', sql.Int, req.params.id) 
      .input('organiserId', sql.Int, req.userId) 
      .query(`SELECT e.*, u.FullName, u.Email, c.CategoryName 
              FROM Enrolments e 
              JOIN Users u ON e.ParticipantID = u.UserID 
              JOIN Categories c ON e.CategoryID = c.CategoryID 
              JOIN Events ev ON c.EventID = ev.EventID 
              WHERE ev.EventID = @eventId AND ev.OrganiserID = @organiserId`); 
    res.json(result.recordset); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 
 
module.exports = { enrolInCategory, getUserEnrolments, cancelEnrolment, getEventEnrolments }; 
