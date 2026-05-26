import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "unsafe_dev_secret";

export function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, displayName: user.display_name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (_err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
