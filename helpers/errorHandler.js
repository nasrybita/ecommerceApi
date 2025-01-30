const errorHandler = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({ message: 'Invalid token' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  module.exports = errorHandler;


