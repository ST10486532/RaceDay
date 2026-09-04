const errorHandler = (err, req, res, next) => { 
  console.error(err.stack); 
  }); 
}; 
 
module.exports = errorHandler; 
