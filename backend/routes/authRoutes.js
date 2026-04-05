const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect, authorize } = require("../middleware/auth");

const generateToken = (id, role) => {
  return jwt.sign({id, role}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

router.post("/login", async (req, res) => {
  try {
    const { password, role } = req.body;

    // Validation
    if (!password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide password and role",
      });
    }

    const user = await User.findOne({ role }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials - incorrect password",
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/me", protect, async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user, // This was added by protect middleware
  });
});

router.get("/admin", protect, authorize("ADMIN"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Admin!",
    data: "This is admin-only data",
  });
});

router.get("/staff-admin", protect, authorize("STAFF", "ADMIN"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Staff or Admin!",
    data: "This data is accessible to staff and admins",
  });
});

module.exports = router;
