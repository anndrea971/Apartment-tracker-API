const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'You must be logged in to perform this action' });
};

module.exports = ensureAuthenticated;
