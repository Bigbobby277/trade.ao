import jwt from "jsonwebtoken";

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

// Blocks access to paid features unless the user's subscription is active
export function requireActiveSubscription(req, res, next) {
  if (req.user?.subscription?.status !== "active") {
    return res.status(402).json({ error: "Active subscription required" });
  }
  next();
}
