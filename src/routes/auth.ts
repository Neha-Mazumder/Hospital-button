import express from "express";
import db from "../db_connect/db.ts";
import bcrypt from "bcrypt";

const router = express.Router();

// Register
router.post("/register", (req, res) => {
  const { fullName, phone, address, username, password } = req.body;

  if (!fullName || !phone || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // check username exists
  db.query(
    "SELECT * FROM login WHERE username = ?",
    [username],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });

      if ((result as any).length > 0) {
        return res.status(400).json({ message: "This username is already taken" });
      }

      // Insert into users
      db.query(
        "INSERT INTO users (full_name, phone, address) VALUES (?, ?, ?)",
        [fullName, phone, address],
        async (err2, result2: any) => {
          if (err2) return res.status(500).json({ message: err2.message });

          const userId = result2.insertId;

          // Hash password with bcrypt
          const hashedPassword = await bcrypt.hash(password, 10);

          // Insert into login (hashed password)
          db.query(
            "INSERT INTO login (user_id, username, password) VALUES (?, ?, ?)",
            [userId, username, hashedPassword],
            (err3) => {
              if (err3) return res.status(500).json({ message: err3.message });
              return res.status(201).json({ 
                message: "Registration successful! Please login now." 
              });
            }
          );
        }
      );
    }
  );
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  db.query(
    "SELECT l.*, u.full_name, u.user_id, u.phone FROM login l JOIN users u ON l.user_id = u.user_id WHERE username = ?",
    [username],
    async (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: err.message });
      }
      
      if ((result as any).length === 0) {
        console.log("User not found:", username);
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const user = (result as any)[0];
      console.log("User found:", username, "Password hash starts with:", user.password.substring(0, 10));

      let isMatch = false;

      // Check if password is hashed (bcrypt hashes start with $2b$)
      if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
        // Compare hashed password
        isMatch = await bcrypt.compare(password, user.password);
        console.log("Bcrypt comparison result:", isMatch);
      } else {
        // Compare plaintext password (for old users)
        isMatch = password === user.password;
        console.log("Plaintext comparison result:", isMatch);
      }

      if (!isMatch) {
        console.log("Password mismatch for user:", username);
        return res.status(401).json({ message: "Invalid username or password" });
      }

      console.log("Login successful for user:", username);
      return res.status(200).json({ 
        message: "Login successful",
        user: {
          user_id: user.user_id,
          full_name: user.full_name,
          username: user.username,
          phone: user.phone
        }
      });
    }
  );
});

export default router;
