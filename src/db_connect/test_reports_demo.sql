-- Table for storing patient test reports
CREATE TABLE IF NOT EXISTS test_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id VARCHAR(50) NOT NULL,
  test_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  status ENUM('Ready','Processing','Pending') DEFAULT 'Pending',
  doctor VARCHAR(100),
  file_path VARCHAR(255)
);

-- Demo data
INSERT INTO test_reports (patient_id, test_name, date, status, doctor, file_path) VALUES
('PAT-2026-001', 'Complete Blood Count (CBC)', '2024-12-15', 'Ready', 'Dr. Mohammad Karim', 'reports/cbc_PAT-2026-001.pdf'),
('PAT-2026-001', 'Liver Function Test', '2024-12-10', 'Ready', 'Dr. Fatima Akhtar', 'reports/lft_PAT-2026-001.pdf'),
('PAT-2026-001', 'Electrolyte Panel', '2024-12-16', 'Processing', 'Dr. Karim Ahsan', NULL),
('PAT-2026-002', 'Blood Sugar', '2024-12-12', 'Ready', 'Dr. Fatima Akhtar', 'reports/bs_PAT-2026-002.pdf');
