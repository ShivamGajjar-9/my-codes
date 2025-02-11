const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Extract token from the Authorization header
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Access denied." });

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = verifyToken;