const jwt = require("jsonwebtoken");

const bookingAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId, role: decoded.role };

    // Optional: allow only users to create bookings
    if (req.method === "POST" && decoded.role !== "user") {
      return res.status(403).json({ message: "Access denied: Users only" });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = bookingAuth;
