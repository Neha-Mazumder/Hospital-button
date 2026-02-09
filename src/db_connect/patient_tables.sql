-- =====================================================
-- Patient-Centered Medical Update System
-- নতুন টেবিল তৈরির SQL স্ক্রিপ্ট
-- phpMyAdmin এ hp_db database সিলেক্ট করে এটি রান করুন
-- =====================================================

-- --------------------------------------------------------
-- Table: patients (রোগীদের মূল তথ্য)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `patients` (
  `patient_id` varchar(20) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `age` int(11) NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `blood_group` varchar(5) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `emergency_contact` varchar(20) DEFAULT NULL,
  `admission_date` date NOT NULL,
  `discharge_date` date DEFAULT NULL,
  `current_status` enum('Admitted','Discharged','Under Treatment','Critical','Stable','Recovering') DEFAULT 'Admitted',
  `assigned_doctor` varchar(100) DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL,
  `room_number` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`patient_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: patient_medical_records (রোগ নির্ণয় / Diagnoses)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `patient_medical_records` (
  `record_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` varchar(20) NOT NULL,
  `diagnosis` varchar(255) NOT NULL,
  `diagnosis_details` text DEFAULT NULL,
  `severity` enum('Mild','Moderate','Severe','Critical') DEFAULT 'Moderate',
  `symptoms` text DEFAULT NULL,
  `treatment_plan` text DEFAULT NULL,
  `diagnosis_date` date NOT NULL,
  `follow_up_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`record_id`),
  KEY `patient_id` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: patient_prescriptions (ওষুধের তালিকা)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `patient_prescriptions` (
  `prescription_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` varchar(20) NOT NULL,
  `medicine_name` varchar(100) NOT NULL,
  `dosage` varchar(50) NOT NULL,
  `frequency` varchar(50) NOT NULL,
  `duration` varchar(50) NOT NULL,
  `instructions` text DEFAULT NULL,
  `prescribed_by` varchar(100) NOT NULL,
  `prescribed_date` date NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`prescription_id`),
  KEY `patient_id` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: patient_vitals (স্বাস্থ্য অবস্থা / Vitals)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `patient_vitals` (
  `vital_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` varchar(20) NOT NULL,
  `blood_pressure` varchar(20) DEFAULT NULL,
  `heart_rate` int(11) DEFAULT NULL,
  `temperature` decimal(4,1) DEFAULT NULL,
  `oxygen_level` int(11) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `blood_sugar` int(11) DEFAULT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `recorded_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`vital_id`),
  KEY `patient_id` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- ডেমো ডাটা (Demo Data)
-- =========================================================

-- রোগীদের তথ্য (Patients)
INSERT INTO `patients` (`patient_id`, `user_id`, `full_name`, `age`, `gender`, `blood_group`, `phone`, `email`, `address`, `emergency_contact`, `admission_date`, `discharge_date`, `current_status`, `assigned_doctor`, `department`, `room_number`) VALUES
('PAT-2026-001', 3, 'রহিম উদ্দিন', 45, 'Male', 'A+', '01712345678', 'rahim@example.com', 'ঢাকা, বাংলাদেশ', '01898765432', '2026-01-15', NULL, 'Under Treatment', 'ডাঃ আব্দুল করিম', 'Cardiology', '301'),
('PAT-2026-002', NULL, 'ফাতেমা বেগম', 35, 'Female', 'B+', '01812345678', 'fatema@example.com', 'চট্টগ্রাম, বাংলাদেশ', '01787654321', '2026-01-18', NULL, 'Stable', 'ডাঃ নাসরিন আক্তার', 'Orthopedics', '205'),
('PAT-2026-003', NULL, 'করিম আহমেদ', 55, 'Male', 'O+', '01612345678', 'karim@example.com', 'সিলেট, বাংলাদেশ', '01676543210', '2026-01-10', '2026-01-20', 'Discharged', 'ডাঃ হাসান মাহমুদ', 'Neurology', '102');

-- রোগ নির্ণয় (Medical Records / Diagnoses)
INSERT INTO `patient_medical_records` (`patient_id`, `diagnosis`, `diagnosis_details`, `severity`, `symptoms`, `treatment_plan`, `diagnosis_date`, `follow_up_date`, `notes`) VALUES
('PAT-2026-001', 'হৃদরোগ (Coronary Artery Disease)', 'বাম করোনারি ধমনীতে ৬০% ব্লকেজ পাওয়া গেছে', 'Moderate', 'বুকে ব্যথা, শ্বাসকষ্ট, ক্লান্তি', 'ওষুধ সেবন এবং নিয়মিত ব্যায়াম। ৩ মাস পর পুনরায় পরীক্ষা।', '2026-01-15', '2026-04-15', 'রোগী ধূমপান ত্যাগ করেছেন। প্রগতি সন্তোষজনক।'),
('PAT-2026-001', 'উচ্চ রক্তচাপ (Hypertension)', 'রক্তচাপ ১৫০/৯৫ mmHg', 'Mild', 'মাথা ব্যথা, ঘাড়ে ব্যথা', 'দৈনিক ওষুধ সেবন এবং লবণ কম খাওয়া', '2026-01-16', '2026-02-16', 'রক্তচাপ নিয়ন্ত্রণে আসছে'),
('PAT-2026-002', 'হাঁটু প্রতিস্থাপন প্রয়োজন (Knee Replacement)', 'ডান হাঁটুতে আর্থ্রাইটিস', 'Moderate', 'হাঁটুতে তীব্র ব্যথা, হাঁটতে অসুবিধা', 'অপারেশনের জন্য প্রস্তুতি নেওয়া হচ্ছে', '2026-01-18', '2026-01-25', 'অপারেশন ২৫ জানুয়ারি নির্ধারিত'),
('PAT-2026-003', 'মাইগ্রেন (Migraine)', 'দীর্ঘস্থায়ী মাইগ্রেন সমস্যা', 'Mild', 'তীব্র মাথা ব্যথা, বমি বমি ভাব', 'ট্রিগার এড়িয়ে চলা এবং ওষুধ সেবন', '2026-01-10', '2026-02-10', 'সুস্থ হয়ে ছাড়া পেয়েছেন');

-- প্রেসক্রিপশন (Prescriptions)
INSERT INTO `patient_prescriptions` (`patient_id`, `medicine_name`, `dosage`, `frequency`, `duration`, `instructions`, `prescribed_by`, `prescribed_date`, `is_active`) VALUES
('PAT-2026-001', 'Aspirin 75mg', '১টি ট্যাবলেট', 'দিনে ১ বার (সকালে)', '৯০ দিন', 'খাবারের পর খাবেন', 'ডাঃ আব্দুল করিম', '2026-01-15', 1),
('PAT-2026-001', 'Atorvastatin 20mg', '১টি ট্যাবলেট', 'দিনে ১ বার (রাতে)', '৯০ দিন', 'রাতের খাবারের পর খাবেন', 'ডাঃ আব্দুল করিম', '2026-01-15', 1),
('PAT-2026-001', 'Amlodipine 5mg', '১টি ট্যাবলেট', 'দিনে ১ বার', '৩০ দিন', 'প্রতিদিন একই সময়ে খাবেন', 'ডাঃ আব্দুল করিম', '2026-01-16', 1),
('PAT-2026-002', 'Paracetamol 500mg', '১-২ টি ট্যাবলেট', 'প্রয়োজনে দিনে ৩ বার', '১৫ দিন', 'ব্যথা হলে খাবেন, ৪ ঘন্টা গ্যাপ রাখবেন', 'ডাঃ নাসরিন আক্তার', '2026-01-18', 1),
('PAT-2026-002', 'Calcium + Vitamin D', '১টি ট্যাবলেট', 'দিনে ২ বার', '৬০ দিন', 'খাবারের সাথে খাবেন', 'ডাঃ নাসরিন আক্তার', '2026-01-18', 1),
('PAT-2026-003', 'Sumatriptan 50mg', '১টি ট্যাবলেট', 'মাইগ্রেন শুরু হলে', 'প্রয়োজনে', 'দিনে সর্বোচ্চ ২টি', 'ডাঃ হাসান মাহমুদ', '2026-01-10', 0);

-- স্বাস্থ্য অবস্থা (Vitals)
INSERT INTO `patient_vitals` (`patient_id`, `blood_pressure`, `heart_rate`, `temperature`, `oxygen_level`, `weight`, `blood_sugar`, `recorded_by`) VALUES
('PAT-2026-001', '140/90', 78, 98.4, 97, 72.50, 110, 'নার্স সালমা'),
('PAT-2026-001', '138/88', 76, 98.2, 98, 72.30, 105, 'নার্স সালমা'),
('PAT-2026-001', '135/85', 74, 98.6, 98, 72.00, 100, 'নার্স রহিমা'),
('PAT-2026-002', '120/80', 72, 98.4, 99, 65.00, 95, 'নার্স ফারিয়া'),
('PAT-2026-002', '118/78', 70, 98.2, 99, 64.80, 92, 'নার্স ফারিয়া'),
('PAT-2026-003', '125/82', 68, 98.0, 99, 78.00, 88, 'নার্স সালমা');

-- =========================================================
-- সম্পন্ন! 
-- এখন http://localhost:5173/medical-update এ যান
-- Demo Patient ID: PAT-2026-001 দিয়ে লগইন করুন
-- =========================================================
