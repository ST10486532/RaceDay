const { getConnection, sql } = require('../config/database'); 
 
const getAllEvents = async (req, res) => { 
  try { 
    const pool = await getConnection(); 
    const result = await pool.request() 
      .query(`SELECT e.*, u.FullName as OrganiserName 
              FROM Events e 
              JOIN Users u ON e.OrganiserID = u.UserID 
              ORDER BY e.EventDate`); 
    res.json(result.recordset); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 
 
const getEventById = async (req, res) => { 
  try { 
    const pool = await getConnection(); 
    const result = await pool.request() 
      .input('eventId', sql.Int, req.params.id) 
      .query(`SELECT e.*, u.FullName as OrganiserName 
              FROM Events e 
              JOIN Users u ON e.OrganiserID = u.UserID 
              WHERE e.EventID = @eventId`); 
    if (result.recordset.length === 0) { 
      return res.status(404).json({ error: 'Event not found' }); 
    } 
    res.json(result.recordset[0]); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 
 
const createEvent = async (req, res) => { 
  try { 
    const { eventName, eventDate, location, eventType, description } = req.body; 
    const pool = await getConnection(); 
    const result = await pool.request() 
      .input('organiserId', sql.Int, req.userId) 
      .input('eventName', sql.VarChar, eventName) 
      .input('eventDate', sql.Date, eventDate) 
      .input('location', sql.VarChar, location) 
      .input('eventType', sql.VarChar, eventType) 
      .input('description', sql.VarChar, description || null) 
      .query(`INSERT INTO Events (OrganiserID, EventName, EventDate, Location, EventType, Description) 
              OUTPUT INSERTED.* 
              VALUES (@organiserId, @eventName, @eventDate, @location, @eventType, @description)`); 
    res.status(201).json(result.recordset[0]); 
  } catch (error) { 
    res.status(400).json({ error: error.message }); 
  } 
}; 
 
const updateEvent = async (req, res) => { 
  try { 
    const { eventName, eventDate, location, eventType, description } = req.body; 
    const pool = await getConnection(); 
    const check = await pool.request() 
      .input('eventId', sql.Int, req.params.id) 
      .input('organiserId', sql.Int, req.userId) 
      .query('SELECT EventID FROM Events WHERE EventID = @eventId AND OrganiserID = @organiserId'); 
    if (check.recordset.length === 0) { 
      return res.status(403).json({ error: 'Not the owner or event not found' }); 
    } 
    const result = await pool.request() 
      .input('eventId', sql.Int, req.params.id) 
      .input('eventName', sql.VarChar, eventName) 
      .input('eventDate', sql.Date, eventDate) 
      .input('location', sql.VarChar, location) 
      .input('eventType', sql.VarChar, eventType) 
      .input('description', sql.VarChar, description) 
      .query(`UPDATE Events 
              SET EventName = @eventName, EventDate = @eventDate, 
                  Location = @location, EventType = @eventType, 
                  Description = @description 
              OUTPUT INSERTED.* 
              WHERE EventID = @eventId`); 
    res.json(result.recordset[0]); 
  } catch (error) { 
    res.status(400).json({ error: error.message }); 
  } 
}; 
 
const deleteEvent = async (req, res) => { 
  try { 
    const pool = await getConnection(); 
    const check = await pool.request() 
      .input('eventId', sql.Int, req.params.id) 
      .input('organiserId', sql.Int, req.userId) 
      .query('SELECT EventID FROM Events WHERE EventID = @eventId AND OrganiserID = @organiserId'); 
    if (check.recordset.length === 0) { 
      return res.status(403).json({ error: 'Not the owner or event not found' }); 
    } 
    await pool.request() 
      .input('eventId', sql.Int, req.params.id) 
      .query('DELETE FROM Events WHERE EventID = @eventId'); 
    res.json({ message: 'Event deleted successfully' }); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 
 
module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent }; 
