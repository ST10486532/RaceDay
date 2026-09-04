const { getConnection, sql } = require('../config/database'); 
 
const getProfile = async (req, res) => { 
  try { 
    const pool = await getConnection(); 
    const result = await pool.request() 
      .input('userId', sql.Int, req.userId) 
      .query(`SELECT UserID, FullName, Email, Role, CreatedAt 
              FROM Users WHERE UserID = @userId`); 
    if (result.recordset.length === 0) { 
      return res.status(404).json({ error: 'User not found' }); 
    } 
    res.json(result.recordset[0]); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 
 
const updateProfile = async (req, res) => { 
  try { 
    const { fullName, email } = req.body; 
    const pool = await getConnection(); 
    const result = await pool.request() 
      .input('userId', sql.Int, req.userId) 
      .input('fullName', sql.VarChar, fullName) 
      .input('email', sql.VarChar, email) 
      .query(`UPDATE Users 
              SET FullName = @fullName, Email = @email 
              OUTPUT INSERTED.UserID, INSERTED.FullName, INSERTED.Email, INSERTED.Role 
              WHERE UserID = @userId`); 
    if (result.recordset.length === 0) { 
      return res.status(404).json({ error: 'User not found' }); 
    } 
    res.json(result.recordset[0]); 
  } catch (error) { 
    res.status(400).json({ error: error.message }); 
  } 
}; 
 
module.exports = { getProfile, updateProfile }; 
