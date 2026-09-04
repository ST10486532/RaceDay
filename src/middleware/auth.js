const jwt = require('jsonwebtoken'); 
 
const auth = (req, res, next) =
  try { 
    const token = req.header('Authorization')?.replace('Bearer ', ''); 
    if (!token) { 
      return res.status(401).json({ error: 'Authentication required' }); 
    } 
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.userId = decoded.userId; 
    req.role = decoded.role; 
    next(); 
  } catch (error) { 
    res.status(401).json({ error: 'Invalid or expired token' }); 
  } 
}; 
 
const organizerOnly = (req, res, next) =
  if (req.role !== 'Organiser') { 
    return res.status(403).json({ error: 'Organiser access required' }); 
  } 
  next(); 
}; 
 
const participantOnly = (req, res, next) =
  if (req.role !== 'Participant') { 
    return res.status(403).json({ error: 'Participant access required' }); 
  } 
  next(); 
}; 
 
module.exports = { auth, organizerOnly, participantOnly }; 
