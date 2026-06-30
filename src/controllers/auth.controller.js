const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function registerUser(req, res, next) {
  try {
    const { email, password } = req.validated.body;
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const role =
      process.env.ADMIN_EMAIL &&
      email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()
        ? "admin"
        : "user";

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ email, passwordHash, role });
    user.uid = user._id.toString();
    await user.save();

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET must be configured");
    }

    const token = jwt.sign(
      { uid: user.uid, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: "7d" },
    );

    return res.status(201).json({
      id: user._id,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    return next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.validated.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET must be configured");
    }

    const token = jwt.sign(
      { uid: user._id.toString(), email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: "7d" },
    );

    return res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { registerUser, loginUser };
