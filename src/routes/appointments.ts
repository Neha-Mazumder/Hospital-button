import express from "express";
import db from "../db_connect/db.ts";

const router = express.Router();

// Get all departments
router.get("/departments", (req, res) => {
  db.query("SELECT * FROM departments", (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    return res.status(200).json(result);
  });
});

// Book appointment
router.post("/book", (req, res) => {
  const { user_id, department_id, appointment_date, additional_message } = req.body;

  if (!user_id || !department_id || !appointment_date) {
    return res.status(400).json({ message: "All required fields must be filled" });
  }

  db.query(
    "INSERT INTO appointments (user_id, department_id, appointment_date, additional_message, status) VALUES (?, ?, ?, ?, ?)",
    [user_id, department_id, appointment_date, additional_message || null, "Pending"],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });
      return res.status(201).json({ message: "Appointment booked successfully" });
    }
  );
});

// Get user appointments
router.get("/user/:user_id", (req, res) => {
  const { user_id } = req.params;

  db.query(
    "SELECT a.*, d.department_name FROM appointments a JOIN departments d ON a.department_id = d.department_id WHERE a.user_id = ? ORDER BY a.appointment_date DESC",
    [user_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      return res.status(200).json(result);
    }
  );
});

// Cancel appointment
router.put("/cancel/:appointment_id", (req, res) => {
  const { appointment_id } = req.params;

  db.query(
    "UPDATE appointments SET status = ? WHERE appointment_id = ?",
    ["Cancelled", appointment_id],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });
      return res.status(200).json({ message: "Appointment cancelled successfully" });
    }
  );
});

export default router;
