// Add health check endpoint 
const app = require('./src/app'); 
 
app.get('/health', (req, res) => { 
  res.json({ status: 'OK', timestamp: new Date().toISOString() }); 
}); 
 
app.listen(PORT, () => { 
  console.log(`?? Server running on port ${PORT}`); 
}); 
