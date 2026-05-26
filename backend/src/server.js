import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import pool, { initDb } from "./db.js";
import { authRequired, signToken } from "./auth.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 8080);
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

app.use(cors({ origin: allowedOrigin === "*" ? true : allowedOrigin }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "fortune-backend" });
});

app.post("/api/auth/register", async (req, res) => {
  const { email, password, displayName } = req.body ?? {};
  if (!email || !password || !displayName) {
    return res.status(400).json({ error: "email, password, displayName are required" });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const [insertResult] = await pool.query(
      "INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)",
      [email, passwordHash, displayName]
    );
    const userId = insertResult.insertId;
    const [rows] = await pool.query(
      "SELECT id, email, display_name FROM users WHERE id = ?",
      [userId]
    );
    const token = signToken(rows[0]);
    return res.status(201).json({ token, user: rows[0] });
  } catch (err) {
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email already exists" });
    }
    return res.status(500).json({ error: "Failed to register" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, email, display_name, password_hash FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken(user);
    return res.json({
      token,
      user: { id: user.id, email: user.email, display_name: user.display_name }
    });
  } catch (_err) {
    return res.status(500).json({ error: "Failed to login" });
  }
});

app.get("/api/me", authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, email, display_name, created_at FROM users WHERE id = ?",
      [req.user.userId]
    );
    return res.json({ user: rows[0] || null });
  } catch (_err) {
    return res.status(500).json({ error: "Failed to get user info" });
  }
});

app.post("/api/orders", authRequired, async (req, res) => {
  const { fortuneType, question, amountCny } = req.body ?? {};
  if (!fortuneType || !question) {
    return res.status(400).json({ error: "fortuneType and question are required" });
  }
  const amount = Number(amountCny || 19.9);
  if (Number.isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "amountCny must be a positive number" });
  }

  try {
    const [insertResult] = await pool.query(
      "INSERT INTO orders (user_id, fortune_type, question, amount_cny) VALUES (?, ?, ?, ?)",
      [req.user.userId, fortuneType, question, amount.toFixed(2)]
    );
    const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [insertResult.insertId]);
    return res.status(201).json({ order: rows[0] });
  } catch (_err) {
    return res.status(500).json({ error: "Failed to create order" });
  }
});

app.get("/api/orders", authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, fortune_type, question, amount_cny, status, result_text, created_at, updated_at FROM orders WHERE user_id = ? ORDER BY id DESC",
      [req.user.userId]
    );
    return res.json({ orders: rows });
  } catch (_err) {
    return res.status(500).json({ error: "Failed to get orders" });
  }
});

async function main() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error("Startup failed:", err.message);
  process.exit(1);
});
