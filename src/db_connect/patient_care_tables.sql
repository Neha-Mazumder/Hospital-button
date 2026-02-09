-- =====================================================
-- Patient Care Real-Time Update System
-- রোগীর Real-Time আপডেট সিস্টেম
-- phpMyAdmin এ hp_db database সিলেক্ট করে এটি রান করুন
-- =====================================================

-- --------------------------------------------------------
-- Table: patients (ভর্তি রোগীদের তথ্য)
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
  `current_status` enum('Admitted','Discharged','Under Treatment','Critical','Stable','Recovering','In Surgery','Observation') DEFAULT 'Admitted',
  `assigned_doctor` varchar(100) DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL,
  `room_number` varchar(20) DEFAULT NULL,
  `bed_number` varchar(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`patient_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: patient_status_updates (Real-time স্ট্যাটাস আপডেট)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `patient_status_updates` (
  `update_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` varchar(20) NOT NULL,
  `status_type` enum('Health Update','Doctor Visit','Treatment','Medicine','Test','Surgery','Discharge','Emergency','General') NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_important` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`update_id`),
  KEY `patient_id` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: doctor_visits (ডাক্তার ভিজিট শিডিউল)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `doctor_visits` (
  `visit_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` varchar(20) NOT NULL,
  `doctor_name` varchar(100) NOT NULL,
  `doctor_specialization` varchar(100) DEFAULT NULL,
  `visit_date` date NOT NULL,
  `visit_time` time NOT NULL,
  `visit_type` enum('Regular Checkup','Follow-up','Emergency','Consultation','Pre-Surgery','Post-Surgery') DEFAULT 'Regular Checkup',
  `status` enum('Scheduled','Completed','Cancelled','Delayed') DEFAULT 'Scheduled',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`visit_id`),
  KEY `patient_id` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: patient_medicines (রোগীর ওষুধের তালিকা)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `patient_medicines` (
  `medicine_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` varchar(20) NOT NULL,
  `medicine_name` varchar(100) NOT NULL,
  `dosage` varchar(50) NOT NULL,
  `frequency` varchar(100) NOT NULL,
  `timing` varchar(100) DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `instructions` text DEFAULT NULL,
  `prescribed_by` varchar(100) NOT NULL,
  `prescribed_date` date NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `next_dose_time` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`medicine_id`),
  KEY `patient_id` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: patient_vitals (স্বাস্থ্য পরিমাপ)
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
  `respiratory_rate` int(11) DEFAULT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `recorded_by` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`vital_id`),
  KEY `patient_id` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: patient_diagnoses (রোগ নির্ণয়)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `patient_diagnoses` (
  `diagnosis_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` varchar(20) NOT NULL,
  `diagnosis` varchar(255) NOT NULL,
  `diagnosis_details` text DEFAULT NULL,
  `severity` enum('Mild','Moderate','Severe','Critical') DEFAULT 'Moderate',
  `symptoms` text DEFAULT NULL,
  `treatment_plan` text DEFAULT NULL,
  `diagnosed_by` varchar(100) DEFAULT NULL,
  `diagnosis_date` date NOT NULL,
  `follow_up_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`diagnosis_id`),
  KEY `patient_id` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- ডেমো ডাটা (Demo Data)
-- =========================================================

-- রোগী ১: রহিম উদ্দিন (Cardiology - হৃদরোগ)
INSERT INTO `patients` (`patient_id`, `user_id`, `full_name`, `age`, `gender`, `blood_group`, `phone`, `email`, `address`, `emergency_contact`, `admission_date`, `current_status`, `assigned_doctor`, `department`, `room_number`, `bed_number`) VALUES
('PAT-2026-001', 3, 'রহিম উদ্দিন', 45, 'Male', 'A+', '01712345678', 'rahim@example.com', 'মিরপুর-১০, ঢাকা', '01898765432', '2026-01-15', 'Under Treatment', 'ডাঃ আব্দুল করিম', 'Cardiology', '301', 'A');

-- রোগী ২: ফাতেমা বেগম (Orthopedics)
INSERT INTO `patients` (`patient_id`, `full_name`, `age`, `gender`, `blood_group`, `phone`, `email`, `address`, `emergency_contact`, `admission_date`, `current_status`, `assigned_doctor`, `department`, `room_number`, `bed_number`) VALUES
('PAT-2026-002', 'ফাতেমা বেগম', 35, 'Female', 'B+', '01812345678', 'fatema@example.com', 'আগ্রাবাদ, চট্টগ্রাম', '01787654321', '2026-01-18', 'Stable', 'ডাঃ নাসরিন আক্তার', 'Orthopedics', '205', 'B');

-- রোগী ৩: করিম আহমেদ (Neurology - Discharged)
INSERT INTO `patients` (`patient_id`, `full_name`, `age`, `gender`, `blood_group`, `phone`, `email`, `address`, `emergency_contact`, `admission_date`, `discharge_date`, `current_status`, `assigned_doctor`, `department`, `room_number`, `bed_number`) VALUES
('PAT-2026-003', 'করিম আহমেদ', 55, 'Male', 'O+', '01612345678', 'karim@example.com', 'জিন্দাবাজার, সিলেট', '01676543210', '2026-01-10', '2026-01-20', 'Discharged', 'ডাঃ হাসান মাহমুদ', 'Neurology', '102', 'A');

-- --------------------------------------------------------
-- Real-Time Status Updates (রহিম উদ্দিন)
-- --------------------------------------------------------

INSERT INTO `patient_status_updates` (`patient_id`, `status_type`, `title`, `description`, `updated_by`, `updated_at`, `is_important`) VALUES
('PAT-2026-001', 'Health Update', 'ভর্তির সময় অবস্থা', 'রোগী বুকে ব্যথা নিয়ে ভর্তি হয়েছেন। প্রাথমিক পরীক্ষা সম্পন্ন।', 'নার্স সালমা', '2026-01-15 10:00:00', 1),
('PAT-2026-001', 'Test', 'ECG পরীক্ষা সম্পন্ন', 'ECG রিপোর্টে সামান্য অস্বাভাবিকতা পাওয়া গেছে। বিস্তারিত পরীক্ষা প্রয়োজন।', 'ডাঃ আব্দুল করিম', '2026-01-15 14:30:00', 1),
('PAT-2026-001', 'Medicine', 'নতুন ওষুধ শুরু', 'হৃদরোগের জন্য নতুন ওষুধ শুরু করা হয়েছে।', 'ডাঃ আব্দুল করিম', '2026-01-16 09:00:00', 0),
('PAT-2026-001', 'Doctor Visit', 'ডাক্তার রাউন্ড সম্পন্ন', 'ডাঃ আব্দুল করিম সকালে ভিজিট করেছেন। রোগীর অবস্থা স্থিতিশীল।', 'নার্স রহিমা', '2026-01-21 08:30:00', 0),
('PAT-2026-001', 'Health Update', 'বর্তমান অবস্থা উন্নতি', 'রক্তচাপ নিয়ন্ত্রণে আসছে। বুকে ব্যথা কমেছে।', 'নার্স সালমা', '2026-01-21 12:00:00', 1),
('PAT-2026-001', 'Treatment', 'ফিজিওথেরাপি শুরু', 'হালকা ব্যায়াম ও ফিজিওথেরাপি শুরু করা হয়েছে।', 'ফিজিওথেরাপিস্ট আলী', '2026-01-21 15:00:00', 0);

-- Status Updates (ফাতেমা বেগম)
INSERT INTO `patient_status_updates` (`patient_id`, `status_type`, `title`, `description`, `updated_by`, `updated_at`, `is_important`) VALUES
('PAT-2026-002', 'Health Update', 'ভর্তির সময় অবস্থা', 'রোগী হাঁটু ব্যথা নিয়ে ভর্তি হয়েছেন। X-Ray করা হবে।', 'নার্স ফারিয়া', '2026-01-18 11:00:00', 1),
('PAT-2026-002', 'Test', 'X-Ray সম্পন্ন', 'ডান হাঁটুতে আর্থ্রাইটিস ধরা পড়েছে।', 'রেডিওলজিস্ট', '2026-01-18 16:00:00', 1),
('PAT-2026-002', 'Surgery', 'অপারেশন নির্ধারিত', 'হাঁটু প্রতিস্থাপন অপারেশন ২৫ জানুয়ারি নির্ধারিত।', 'ডাঃ নাসরিন আক্তার', '2026-01-19 10:00:00', 1);

-- --------------------------------------------------------
-- Doctor Visits Schedule
-- --------------------------------------------------------

INSERT INTO `doctor_visits` (`patient_id`, `doctor_name`, `doctor_specialization`, `visit_date`, `visit_time`, `visit_type`, `status`, `notes`) VALUES
('PAT-2026-001', 'ডাঃ আব্দুল করিম', 'Cardiologist', '2026-01-21', '08:00:00', 'Regular Checkup', 'Completed', 'সকালের রাউন্ড সম্পন্ন'),
('PAT-2026-001', 'ডাঃ আব্দুল করিম', 'Cardiologist', '2026-01-21', '18:00:00', 'Follow-up', 'Scheduled', 'সন্ধ্যায় ফলো-আপ ভিজিট'),
('PAT-2026-001', 'ডাঃ আব্দুল করিম', 'Cardiologist', '2026-01-22', '08:30:00', 'Regular Checkup', 'Scheduled', 'পরবর্তী সকালের রাউন্ড'),
('PAT-2026-002', 'ডাঃ নাসরিন আক্তার', 'Orthopedic Surgeon', '2026-01-21', '10:00:00', 'Pre-Surgery', 'Scheduled', 'অপারেশন পূর্ব পরীক্ষা'),
('PAT-2026-002', 'ডাঃ নাসরিন আক্তার', 'Orthopedic Surgeon', '2026-01-25', '09:00:00', 'Surgery', 'Scheduled', 'হাঁটু প্রতিস্থাপন অপারেশন');

-- --------------------------------------------------------
-- Patient Medicines (রোগীর ওষুধ)
-- --------------------------------------------------------

INSERT INTO `patient_medicines` (`patient_id`, `medicine_name`, `dosage`, `frequency`, `timing`, `duration`, `instructions`, `prescribed_by`, `prescribed_date`, `start_date`, `end_date`, `is_active`, `next_dose_time`) VALUES
('PAT-2026-001', 'Aspirin 75mg', '১টি ট্যাবলেট', 'দিনে ১ বার', 'সকাল ৮:০০ টায়', '৯০ দিন', 'খাবারের পর খাবেন। খালি পেটে খাবেন না।', 'ডাঃ আব্দুল করিম', '2026-01-15', '2026-01-15', '2026-04-15', 1, '2026-01-22 08:00:00'),
('PAT-2026-001', 'Atorvastatin 20mg', '১টি ট্যাবলেট', 'দিনে ১ বার', 'রাত ১০:০০ টায়', '৯০ দিন', 'রাতের খাবারের পর খাবেন।', 'ডাঃ আব্দুল করিম', '2026-01-15', '2026-01-15', '2026-04-15', 1, '2026-01-21 22:00:00'),
('PAT-2026-001', 'Amlodipine 5mg', '১টি ট্যাবলেট', 'দিনে ১ বার', 'সকাল ৮:০০ টায়', '৩০ দিন', 'রক্তচাপ নিয়ন্ত্রণের জন্য।', 'ডাঃ আব্দুল করিম', '2026-01-16', '2026-01-16', '2026-02-16', 1, '2026-01-22 08:00:00'),
('PAT-2026-001', 'Clopidogrel 75mg', '১টি ট্যাবলেট', 'দিনে ১ বার', 'দুপুর ২:০০ টায়', '৩০ দিন', 'রক্ত জমাট বাঁধা প্রতিরোধে।', 'ডাঃ আব্দুল করিম', '2026-01-17', '2026-01-17', '2026-02-17', 1, '2026-01-21 14:00:00'),
('PAT-2026-002', 'Paracetamol 500mg', '১-২টি ট্যাবলেট', 'দিনে ৩ বার (প্রয়োজনে)', 'সকাল, দুপুর, রাত', '১৫ দিন', 'ব্যথা হলে খাবেন। ৪ ঘন্টা গ্যাপ রাখবেন।', 'ডাঃ নাসরিন আক্তার', '2026-01-18', '2026-01-18', '2026-02-02', 1, '2026-01-21 14:00:00'),
('PAT-2026-002', 'Calcium + Vitamin D', '১টি ট্যাবলেট', 'দিনে ২ বার', 'সকাল ও রাত', '৬০ দিন', 'হাড় মজবুত করতে খাবারের সাথে খাবেন।', 'ডাঃ নাসরিন আক্তার', '2026-01-18', '2026-01-18', '2026-03-18', 1, '2026-01-21 20:00:00'),
('PAT-2026-002', 'Omeprazole 20mg', '১টি ক্যাপসুল', 'দিনে ১ বার', 'সকালে খালি পেটে', '১৫ দিন', 'খাবারের ৩০ মিনিট আগে খাবেন।', 'ডাঃ নাসরিন আক্তার', '2026-01-18', '2026-01-18', '2026-02-02', 1, '2026-01-22 07:30:00');

-- --------------------------------------------------------
-- Patient Vitals (স্বাস্থ্য পরিমাপ)
-- --------------------------------------------------------

INSERT INTO `patient_vitals` (`patient_id`, `blood_pressure`, `heart_rate`, `temperature`, `oxygen_level`, `weight`, `blood_sugar`, `respiratory_rate`, `recorded_by`, `recorded_at`, `notes`) VALUES
('PAT-2026-001', '150/95', 82, 98.6, 96, 75.50, 120, 18, 'নার্স সালমা', '2026-01-15 10:30:00', 'ভর্তির সময়'),
('PAT-2026-001', '145/92', 80, 98.4, 97, 75.30, 115, 17, 'নার্স রহিমা', '2026-01-16 08:00:00', 'সকালের চেকআপ'),
('PAT-2026-001', '140/90', 78, 98.4, 97, 75.00, 110, 16, 'নার্স সালমা', '2026-01-17 08:00:00', 'উন্নতি হচ্ছে'),
('PAT-2026-001', '138/88', 76, 98.2, 98, 74.80, 108, 16, 'নার্স রহিমা', '2026-01-18 08:00:00', 'স্থিতিশীল'),
('PAT-2026-001', '135/85', 74, 98.2, 98, 74.50, 105, 15, 'নার্স সালমা', '2026-01-19 08:00:00', 'ভালো অবস্থা'),
('PAT-2026-001', '132/84', 72, 98.0, 99, 74.20, 100, 15, 'নার্স রহিমা', '2026-01-20 08:00:00', 'অবস্থা আরও ভালো'),
('PAT-2026-001', '130/82', 70, 98.2, 99, 74.00, 98, 14, 'নার্স সালমা', '2026-01-21 08:00:00', 'সর্বশেষ চেকআপ - চমৎকার'),
('PAT-2026-002', '120/80', 72, 98.4, 99, 65.00, 95, 16, 'নার্স ফারিয়া', '2026-01-18 12:00:00', 'ভর্তির সময়'),
('PAT-2026-002', '118/78', 70, 98.2, 99, 64.80, 92, 15, 'নার্স ফারিয়া', '2026-01-21 08:00:00', 'স্থিতিশীল');

-- --------------------------------------------------------
-- Patient Diagnoses (রোগ নির্ণয়)
-- --------------------------------------------------------

INSERT INTO `patient_diagnoses` (`patient_id`, `diagnosis`, `diagnosis_details`, `severity`, `symptoms`, `treatment_plan`, `diagnosed_by`, `diagnosis_date`, `follow_up_date`, `notes`, `is_primary`) VALUES
('PAT-2026-001', 'করোনারি আর্টারি ডিজিজ (CAD)', 'বাম করোনারি ধমনীতে ৬০% ব্লকেজ। Angiogram এ নিশ্চিত হয়েছে।', 'Moderate', 'বুকে ব্যথা, শ্বাসকষ্ট, ক্লান্তি, ঘাম', 'ওষুধ সেবন, জীবনযাত্রা পরিবর্তন, নিয়মিত ব্যায়াম। প্রয়োজনে Angioplasty।', 'ডাঃ আব্দুল করিম', '2026-01-15', '2026-04-15', 'ধূমপান ত্যাগ করতে হবে। লবণ ও তেল কম খেতে হবে।', 1),
('PAT-2026-001', 'উচ্চ রক্তচাপ (Hypertension)', 'Stage 1 Hypertension। রক্তচাপ নিয়মিত ১৫০/৯৫ এর উপরে ছিল।', 'Mild', 'মাথা ব্যথা, ঘাড়ে ব্যথা, মাথা ঘোরা', 'দৈনিক ওষুধ সেবন, লবণ কম খাওয়া, নিয়মিত ব্যায়াম।', 'ডাঃ আব্দুল করিম', '2026-01-16', '2026-02-16', 'রক্তচাপ ধীরে ধীরে নিয়ন্ত্রণে আসছে।', 0),
('PAT-2026-002', 'অস্টিওআর্থ্রাইটিস (Knee)', 'ডান হাঁটুতে গুরুতর আর্থ্রাইটিস। X-Ray ও MRI তে নিশ্চিত।', 'Moderate', 'হাঁটুতে তীব্র ব্যথা, ফোলা, হাঁটতে অসুবিধা, সিঁড়ি বাইতে কষ্ট', 'প্রাথমিকভাবে ব্যথানাশক ও ফিজিওথেরাপি। Total Knee Replacement সার্জারি ২৫ জানুয়ারি নির্ধারিত।', 'ডাঃ নাসরিন আক্তার', '2026-01-18', '2026-01-25', 'অপারেশনের আগে রক্ত পরীক্ষা ও ECG করা হবে।', 1);

-- =========================================================
-- Constraints (Foreign Keys)
-- =========================================================

ALTER TABLE `patients`
  ADD CONSTRAINT `patients_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

ALTER TABLE `patient_status_updates`
  ADD CONSTRAINT `status_patient_fk` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE;

ALTER TABLE `doctor_visits`
  ADD CONSTRAINT `visits_patient_fk` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE;

ALTER TABLE `patient_medicines`
  ADD CONSTRAINT `medicines_patient_fk` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE;

ALTER TABLE `patient_vitals`
  ADD CONSTRAINT `vitals_patient_fk` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE;

ALTER TABLE `patient_diagnoses`
  ADD CONSTRAINT `diagnoses_patient_fk` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE;

-- =========================================================
-- সম্পন্ন! 
-- Demo Patient ID: PAT-2026-001 (রহিম উদ্দিন - Cardiology)
-- Demo Patient ID: PAT-2026-002 (ফাতেমা বেগম - Orthopedics)
-- =========================================================
