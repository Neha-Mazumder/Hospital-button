import express from "express";
import db from "../db_connect/db";

const router = express.Router();

// Register
router.post("/register", (req, res) => {
  const { fullName, phone, address, username, password } = req.body;

  if (!fullName || !phone || !username || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  // check username
  db.query(
    "SELECT * FROM login WHERE username = ?",
    [username],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });

      if ((result as any).length > 0) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Insert into users
      db.query(
        "INSERT INTO users (full_name, phone, address) VALUES (?, ?, ?)",
        [fullName, phone, address],
        (err2, result2: any) => {
          if (err2) return res.status(500).json({ message: err2.message });

          const userId = result2.insertId;

          // Insert into login
          db.query(
            "INSERT INTO login (user_id, username, password) VALUES (?, ?, ?)",
            [userId, username, password],
            (err3) => {
              if (err3) return res.status(500).json({ message: err3.message });
              return res.status(201).json({ message: "Registration successful" });
            }
          );
        }
      );
    }
  );
});

// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  db.query(
    "SELECT l.*, u.full_name FROM login l JOIN users u ON l.user_id = u.user_id WHERE username = ? AND password = ?",
    [username, password],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if ((result as any).length === 0) return res.status(401).json({ message: "Invalid credentials" });
      return res.status(200).json({ message: "Login successful", user: (result as any)[0] });
    }
  );
});

export default router;
