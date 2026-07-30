import jwt from "jsonwebtoken";
import User from "../models/User.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const token = header.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Fetch user and check if subscription is active
export async function requireActiveSubscription(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.subscription.status !== "active") {
      return res.status(402).json({ error: "Active subscription required" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ error: "Error checking subscription" });
  }
}

// Check if user is free or paid tier
export async function attachUserTier(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    req.user = user;
    req.isPaid = user?.subscription?.status === "active";
    next();
  } catch (err) {
    return res.status(500).json({ error: "Error fetching user" });
  }
}
