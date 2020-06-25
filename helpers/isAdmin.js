const isAdmin = (req, res, next) => {
  if (req.user.type === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Only Admin' });
  }
}

module.exports = {
  isAdmin
}