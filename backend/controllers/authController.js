const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { completeBooking } = require("./bookingController");

//register

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const emailToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      emailVerificationToken: emailToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hrs
    });

    console.log(
      `Verify email: http://localhost:5000/api/v1/auth/verify-email/${emailToken}`
    );

    res.status(201).json({
      message: "Registered successfully. Please verify email.",
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    console.log("Received token:", token);

    // Use new Date() for UTC-safe comparison
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    console.log("User found:", user);

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify Email Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isEmailVerified)
      return res.status(403).json({ message: "Please verify email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
