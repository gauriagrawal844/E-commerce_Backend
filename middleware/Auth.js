const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  // Check if the Authorization header exists and starts with 'Bearer'
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        // If token is expired, send a specific error message
        return res.status(401).json({ message: "Token has expired" });
      }
      // For other errors, send a generic forbidden message
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    // Store decoded token data in the request for use in the route
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
