import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

const jwtSecret = async (req, res, next) => {
  try {
    // Get token from cookies OR Authorization header
    let token = req.cookies?.accesstoken;

    if (!token && req.header("Authorization")) {
      const authHeader = req.header("Authorization").trim();
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.replace("Bearer ", "");
      }
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized request: no token provided" });
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);

    // Find user (use correct field names from your schema)
    const user = await User.findById(decodedToken._id).select("-passward -tokens");

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized request: invalid token" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(401).json({ success: false, message: "Unauthorized request: token invalid or expired" });
  }
};

export default jwtSecret;