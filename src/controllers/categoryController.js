const { getConnection, sql } = require('../config/database'); 
 
const getCategoriesByEvent = async (req, res) => { 
  try { 
    const pool = await getConnection(); 
    const result = await pool.request() 
      .input('eventId', sql.Int, req.params.id) 
      .query(`SELECT c.*, e.OrganiserID 
              FROM Categories c 
              JOIN Events e ON c.EventID = e.EventID 
              WHERE c.EventID = @eventId`); 
    res.json(result.recordset); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 
 
const addCategory = async (req, res) => { 
  try { 
    const { categoryName, distanceKm, entryFee, maxParticipants } = req.body; 
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
      .input('categoryName', sql.VarChar, categoryName) 
      .input('distanceKm', sql.Decimal, distanceKm) 
      .input('entryFee', sql.Decimal, entryFee || 0) 
      .input('maxParticipants', sql.Int, maxParticipants || 100) 
      .query(`INSERT INTO Categories (EventID, CategoryName, DistanceKm, EntryFee, MaxParticipants) 
              OUTPUT INSERTED.* 
              VALUES (@eventId, @categoryName, @distanceKm, @entryFee, @maxParticipants)`); 
    res.status(201).json(result.recordset[0]); 
  } catch (error) { 
    res.status(400).json({ error: error.message }); 
  } 
}; 
 
const updateCategory = async (req, res) => { 
  try { 
    const { categoryName, distanceKm, entryFee, maxParticipants } = req.body; 
    const pool = await getConnection(); 
    const check = await pool.request() 
      .input('categoryId', sql.Int, req.params.id) 
      .input('organiserId', sql.Int, req.userId) 
      .query(`SELECT c.CategoryID FROM Categories c 
              JOIN Events e ON c.EventID = e.EventID 
              WHERE c.CategoryID = @categoryId AND e.OrganiserID = @organiserId`); 
    if (check.recordset.length === 0) { 
      return res.status(403).json({ error: 'Not the owner or category not found' }); 
    } 
    const result = await pool.request() 
      .input('categoryId', sql.Int, req.params.id) 
      .input('categoryName', sql.VarChar, categoryName) 
      .input('distanceKm', sql.Decimal, distanceKm) 
      .input('entryFee', sql.Decimal, entryFee) 
      .input('maxParticipants', sql.Int, maxParticipants) 
      .query(`UPDATE Categories 
              SET CategoryName = @categoryName, DistanceKm = @distanceKm, 
                  EntryFee = @entryFee, MaxParticipants = @maxParticipants 
              OUTPUT INSERTED.* 
              WHERE CategoryID = @categoryId`); 
    res.json(result.recordset[0]); 
  } catch (error) { 
    res.status(400).json({ error: error.message }); 
  } 
}; 
 
const deleteCategory = async (req, res) => { 
  try { 
    const pool = await getConnection(); 
    const check = await pool.request() 
      .input('categoryId', sql.Int, req.params.id) 
      .input('organiserId', sql.Int, req.userId) 
      .query(`SELECT c.CategoryID FROM Categories c 
              JOIN Events e ON c.EventID = e.EventID 
              WHERE c.CategoryID = @categoryId AND e.OrganiserID = @organiserId`); 
    if (check.recordset.length === 0) { 
      return res.status(403).json({ error: 'Not the owner or category not found' }); 
    } 
    await pool.request() 
      .input('categoryId', sql.Int, req.params.id) 
      .query('DELETE FROM Categories WHERE CategoryID = @categoryId'); 
    res.json({ message: 'Category deleted successfully' }); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 
 
module.exports = { getCategoriesByEvent, addCategory, updateCategory, deleteCategory }; 
