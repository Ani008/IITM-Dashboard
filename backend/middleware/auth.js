const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 1. Check if token exists first
  if (!token || token === "undefined") {
    return res.status(401).json({
      success: false,
      message: "Not Authorized, No Token",
    });
  }

  try {
    // 2. Verify only if token exists
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    // This only logs if the token exists but is invalid/expired
    console.error("JWT Error:", error.message); 
    return res.status(401).json({
      success: false,
      message: "Not Authorized, token failed",
    });
  }
};
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user ? req.user.role : 'unknown'} is not authorized`,
      });
    }
    next();
  };
};
