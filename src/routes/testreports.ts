import { Router } from "express";
import db from "../db_connect/db";
import path from "path";
import fs from "fs";
import archiver from "archiver";

const router = Router();

const query = (sql: string, params?: any[]): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results as any[]);
    });
  });
};

// Get all test reports for a patient
router.get("/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    // Example: test_reports table: id, patient_id, test_name, date, status, doctor, file_path
    const reports = await query(
      `SELECT id, test_name, date, status, doctor, file_path FROM test_reports WHERE patient_id = ? ORDER BY date DESC`,
      [patientId]
    );
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not fetch reports" });
  }
});

// Download a specific report file
router.get("/download/:reportId", async (req, res) => {
  try {
    const { reportId } = req.params;
    const reports = await query(
      `SELECT file_path, test_name FROM test_reports WHERE id = ?`,
      [reportId]
    );
    if (!reports.length) return res.status(404).json({ success: false, message: "Report not found" });
    const { file_path, test_name } = reports[0];
    const file = path.resolve(__dirname, "../../public", file_path);
    if (!fs.existsSync(file)) return res.status(404).json({ success: false, message: "File not found" });
    res.download(file, `${test_name}.pdf`);
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not download report" });
  }
});

// Download all reports for a patient as a zip
router.get("/download-all/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    const reports = await query(
      `SELECT file_path, test_name FROM test_reports WHERE patient_id = ? AND status = 'Ready' AND file_path IS NOT NULL`,
      [patientId]
    );
    if (!reports.length) return res.status(404).json({ success: false, message: "No ready reports found" });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${patientId}_reports.zip"`);

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    for (const report of reports) {
      const file = path.resolve(__dirname, "../../public", report.file_path);
      if (fs.existsSync(file)) {
        archive.file(file, { name: `${report.test_name}.pdf` });
      }
    }
    await archive.finalize();
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not download all reports" });
  }
});

export default router;
