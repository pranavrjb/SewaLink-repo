module.exports = (req, res, next) => {
  if (req.user.role !== "provider") {
    return res.status(403).json({ message: "Providers only" });
  }
  next();
};
