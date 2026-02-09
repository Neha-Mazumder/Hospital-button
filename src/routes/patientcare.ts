import express from "express";
import db from "../db_connect/db.ts";

const router = express.Router();

// Helper function to promisify db.query
const query = (sql: string, params?: any[]): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results as any[]);
    });
  });
};

// Patient Login with Patient ID
router.post("/login", async (req, res) => {
  try {
    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID প্রদান করুন",
      });
    }

    const patients = await query(
      "SELECT * FROM patients WHERE patient_id = ?",
      [patientId]
    );

    if (patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: "রোগী পাওয়া যায়নি। সঠিক Patient ID দিন।",
      });
    }

    res.json({
      success: true,
      message: "সফলভাবে লগইন হয়েছে",
      patient: patients[0],
    });
  } catch (error) {
    console.error("Patient login error:", error);
    res.status(500).json({
      success: false,
      message: "সার্ভার ত্রুটি",
    });
  }
});

// Get complete patient dashboard data
router.get("/dashboard/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    // Get patient info
    const patients = await query(
      "SELECT * FROM patients WHERE patient_id = ?",
      [patientId]
    );

    if (patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: "রোগী পাওয়া যায়নি",
      });
    }

    // Get recent status updates
    const statusUpdates = await query(
      `SELECT * FROM patient_status_updates 
       WHERE patient_id = ? 
       ORDER BY updated_at DESC 
       LIMIT 10`,
      [patientId]
    );

    // Get upcoming doctor visits
    const doctorVisits = await query(
      `SELECT * FROM doctor_visits 
       WHERE patient_id = ? AND (visit_date >= CURDATE() OR (visit_date = CURDATE() AND status = 'Scheduled'))
       ORDER BY visit_date ASC, visit_time ASC`,
      [patientId]
    );

    // Get active medicines
    const medicines = await query(
      `SELECT * FROM patient_medicines 
       WHERE patient_id = ? AND is_active = 1
       ORDER BY next_dose_time ASC`,
      [patientId]
    );

    // Get latest vitals
    const vitals = await query(
      `SELECT * FROM patient_vitals 
       WHERE patient_id = ? 
       ORDER BY recorded_at DESC 
       LIMIT 5`,
      [patientId]
    );

    // Get diagnoses
    const diagnoses = await query(
      `SELECT * FROM patient_diagnoses 
       WHERE patient_id = ? 
       ORDER BY is_primary DESC, diagnosis_date DESC`,
      [patientId]
    );

    res.json({
      success: true,
      data: {
        patient: patients[0],
        statusUpdates,
        doctorVisits,
        medicines,
        vitals,
        diagnoses,
      },
    });
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "সার্ভার ত্রুটি",
    });
  }
});

// Get all status updates for a patient
router.get("/updates/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    const updates = await query(
      `SELECT * FROM patient_status_updates 
       WHERE patient_id = ? 
       ORDER BY updated_at DESC`,
      [patientId]
    );

    res.json({ success: true, updates });
  } catch (error) {
    console.error("Get updates error:", error);
    res.status(500).json({ success: false, message: "সার্ভার ত্রুটি" });
  }
});

// Get doctor visits schedule
router.get("/visits/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    const visits = await query(
      `SELECT * FROM doctor_visits 
       WHERE patient_id = ? 
       ORDER BY visit_date DESC, visit_time DESC`,
      [patientId]
    );

    res.json({ success: true, visits });
  } catch (error) {
    console.error("Get visits error:", error);
    res.status(500).json({ success: false, message: "সার্ভার ত্রুটি" });
  }
});

// Get medicines list
router.get("/medicines/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    const medicines = await query(
      `SELECT * FROM patient_medicines 
       WHERE patient_id = ? 
       ORDER BY is_active DESC, next_dose_time ASC`,
      [patientId]
    );

    res.json({ success: true, medicines });
  } catch (error) {
    console.error("Get medicines error:", error);
    res.status(500).json({ success: false, message: "সার্ভার ত্রুটি" });
  }
});

// Get vitals history
router.get("/vitals/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    const vitals = await query(
      `SELECT * FROM patient_vitals 
       WHERE patient_id = ? 
       ORDER BY recorded_at DESC`,
      [patientId]
    );

    res.json({ success: true, vitals });
  } catch (error) {
    console.error("Get vitals error:", error);
    res.status(500).json({ success: false, message: "সার্ভার ত্রুটি" });
  }
});

// Get diagnoses
router.get("/diagnoses/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    const diagnoses = await query(
      `SELECT * FROM patient_diagnoses 
       WHERE patient_id = ? 
       ORDER BY is_primary DESC, diagnosis_date DESC`,
      [patientId]
    );

    res.json({ success: true, diagnoses });
  } catch (error) {
    console.error("Get diagnoses error:", error);
    res.status(500).json({ success: false, message: "সার্ভার ত্রুটি" });
  }
});

export default router;
