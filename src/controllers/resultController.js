const { getConnection, sql } = require('../config/database'); 
 
const captureResult = async (req, res) => { 
  try { 
    const { finishTime, overallPosition, categoryPosition, status } = req.body; 
    const pool = await getConnection(); 
    const check = await pool.request() 
      .input('enrolmentId', sql.Int, req.params.id) 
      .input('organiserId', sql.Int, req.userId) 
      .query(`SELECT e.EnrolmentID FROM Enrolments e 
              JOIN Categories c ON e.CategoryID = c.CategoryID 
              JOIN Events ev ON c.EventID = ev.EventID 
              WHERE e.EnrolmentID = @enrolmentId AND ev.OrganiserID = @organiserId`); 
    if (check.recordset.length === 0) { 
      return res.status(404).json({ error: 'Enrolment not found or not authorized' }); 
    } 
    const existing = await pool.request() 
      .input('enrolmentId', sql.Int, req.params.id) 
      .query('SELECT ResultID FROM Results WHERE EnrolmentID = @enrolmentId'); 
    if (existing.recordset.length  { 
      return res.status(409).json({ error: 'Result already captured for this enrolment' }); 
    } 
    const result = await pool.request() 
      .input('enrolmentId', sql.Int, req.params.id) 
      .input('finishTime', sql.Time, finishTime || null) 
      .input('overallPosition', sql.Int, overallPosition || null) 
      .input('categoryPosition', sql.Int, categoryPosition || null) 
      .input('status', sql.VarChar, status || 'Finished') 
      .query(`INSERT INTO Results (EnrolmentID, FinishTime, OverallPosition, CategoryPosition, Status) 
              OUTPUT INSERTED.* 
              VALUES (@enrolmentId, @finishTime, @overallPosition, @categoryPosition, @status)`); 
    res.status(201).json(result.recordset[0]); 
  } catch (error) { 
    res.status(400).json({ error: error.message }); 
  } 
}; 
 
const editResult = async (req, res) => { 
  try { 
    const { finishTime, overallPosition, categoryPosition, status } = req.body; 
    const pool = await getConnection(); 
    const check = await pool.request() 
      .input('resultId', sql.Int, req.params.id) 
      .input('organiserId', sql.Int, req.userId) 
      .query(`SELECT r.ResultID FROM Results r 
              JOIN Enrolments e ON r.EnrolmentID = e.EnrolmentID 
              JOIN Categories c ON e.CategoryID = c.CategoryID 
              JOIN Events ev ON c.EventID = ev.EventID 
              WHERE r.ResultID = @resultId AND ev.OrganiserID = @organiserId`); 
    if (check.recordset.length === 0) { 
      return res.status(403).json({ error: 'Not authorized or result not found' }); 
    } 
    const result = await pool.request() 
      .input('resultId', sql.Int, req.params.id) 
      .input('finishTime', sql.Time, finishTime || null) 
      .input('overallPosition', sql.Int, overallPosition || null) 
      .input('categoryPosition', sql.Int, categoryPosition || null) 
      .input('status', sql.VarChar, status) 
      .query(`UPDATE Results 
              SET FinishTime = @finishTime, 
                  OverallPosition = @overallPosition, 
                  CategoryPosition = @categoryPosition, 
                  Status = @status 
              OUTPUT INSERTED.* 
              WHERE ResultID = @resultId`); 
    res.json(result.recordset[0]); 
  } catch (error) { 
    res.status(400).json({ error: error.message }); 
  } 
}; 
 
const getUserResults = async (req, res) => { 
  try { 
    const pool = await getConnection(); 
    const result = await pool.request() 
      .input('participantId', sql.Int, req.userId) 
      .query(`SELECT r.*, c.CategoryName, c.DistanceKm, ev.EventName, ev.EventDate 
              FROM Results r 
              JOIN Enrolments e ON r.EnrolmentID = e.EnrolmentID 
              JOIN Categories c ON e.CategoryID = c.CategoryID 
              JOIN Events ev ON c.EventID = ev.EventID 
              WHERE e.ParticipantID = @participantId`); 
    res.json(result.recordset); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 
 
const getEventResults = async (req, res) => { 
  try { 
    const pool = await getConnection(); 
    const result = await pool.request() 
      .input('eventId', sql.Int, req.params.id) 
      .query(`SELECT r.*, u.FullName, c.CategoryName, c.DistanceKm 
              FROM Results r 
              JOIN Enrolments e ON r.EnrolmentID = e.EnrolmentID 
              JOIN Users u ON e.ParticipantID = u.UserID 
              JOIN Categories c ON e.CategoryID = c.CategoryID 
              JOIN Events ev ON c.EventID = ev.EventID 
              WHERE ev.EventID = @eventId 
              ORDER BY r.OverallPosition`); 
    res.json(result.recordset); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 
 
module.exports = { captureResult, editResult, getUserResults, getEventResults }; 
