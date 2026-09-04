const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const { getConnection, sql } = require('../config/database'); 
 
const register = async (req, res) =
  try { 
    const { fullName, email, password, role } = req.body; 
    const pool = await getConnection(); 
    const checkUser = await pool.request() 
      .input('email', sql.VarChar, email) 
      .query('SELECT UserID FROM Users WHERE Email = @email'); 
    if (checkUser.recordset.length  { 
      return res.status(409).json({ error: 'Email already registered' }); 
    } 
    const hashedPassword = await bcrypt.hash(password, 10); 
    const result = await pool.request() 
      .input('fullName', sql.VarChar, fullName) 
      .input('email', sql.VarChar, email) 
      .input('passwordHash', sql.VarChar, hashedPassword) 
      .input('role', sql.VarChar, role) 
      .query(`INSERT INTO Users (FullName, Email, PasswordHash, Role) 
              OUTPUT INSERTED.UserID, INSERTED.FullName, INSERTED.Email, INSERTED.Role, INSERTED.CreatedAt 
              VALUES (@fullName, @email, @passwordHash, @role)`); 
    res.status(201).json(result.recordset[0]); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 
 
const login = async (req, res) =
  try { 
    const { email, password } = req.body; 
    const pool = await getConnection(); 
    const result = await pool.request() 
      .input('email', sql.VarChar, email) 
      .query('SELECT * FROM Users WHERE Email = @email'); 
    if (result.recordset.length === 0) { 
      return res.status(401).json({ error: 'Invalid credentials' }); 
    } 
    const user = result.recordset[0]; 
    const isValid = await bcrypt.compare(password, user.PasswordHash); 
    if (!isValid) { 
      return res.status(401).json({ error: 'Invalid credentials' }); 
    } 
    const token = jwt.sign( 
      { userId: user.UserID, role: user.Role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' } 
    ); 
    res.json({ token, userId: user.UserID, role: user.Role, fullName: user.FullName }); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 
 
module.exports = { register, login }; 
