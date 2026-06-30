const admin = require("../config/firebaseAdmin");

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication token required" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
      role: decodedToken.role || "user",
    };

    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired authentication token" });
  }
}

module.exports = { requireAuth };
