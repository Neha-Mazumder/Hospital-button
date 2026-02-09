-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 19, 2026 at 04:14 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hp_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `appointment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `appointment_date` date NOT NULL,
  `additional_message` text DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`appointment_id`, `user_id`, `department_id`, `appointment_date`, `additional_message`, `status`) VALUES
(1, 3, 2, '2026-01-09', 'hello world', 'Pending'),
(2, 3, 2, '2026-01-22', 'ascas', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL,
  `department_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_id`, `department_name`) VALUES
(1, 'Cardiology'),
(2, 'Orthopedics'),
(3, 'ENT'),
(4, 'Neurology'),
(5, 'General Medicine');

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `login_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`login_id`, `user_id`, `username`, `password`) VALUES
(3, 3, 'Test@1234', 'Test@1234');

-- --------------------------------------------------------

--
-- Table structure for table `medicines`
--

CREATE TABLE `medicines` (
  `medicine_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `generic_name` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `manufacturer` varchar(100) NOT NULL,
  `stock` int(11) DEFAULT 100,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medicines`
--

INSERT INTO `medicines` (`medicine_id`, `name`, `generic_name`, `category`, `price`, `original_price`, `manufacturer`, `stock`, `description`) VALUES
(1, 'Napa 500mg', 'Paracetamol', 'Pain Relief', 5.00, 8.00, 'Beximco Pharmaceuticals', 100, 'Effective pain relief and fever reducer'),
(2, 'Amoxicillin 500mg', 'Amoxicillin', 'Antibiotics', 15.00, NULL, 'Square Pharmaceuticals', 50, 'Broad-spectrum antibiotic'),
(3, 'Omeprazole 20mg', 'Omeprazole', 'Gastrointestinal', 12.00, NULL, 'Incepta Pharmaceuticals', 75, 'Reduces stomach acid'),
(4, 'Cetirizine 10mg', 'Cetirizine', 'Allergy', 8.00, NULL, 'Renata Limited', 80, 'Antihistamine for allergies'),
(5, 'Vitamin C 1000mg', 'Ascorbic Acid', 'Vitamins', 6.00, NULL, 'ACI Pharmaceuticals', 120, 'Immune system booster'),
(6, 'Ibuprofen 400mg', 'Ibuprofen', 'Pain Relief', 7.00, NULL, 'Beximco Pharmaceuticals', 90, 'Anti-inflammatory pain reliever');

-- --------------------------------------------------------

--
-- Table structure for table `pharmacy_orders`
--

CREATE TABLE `pharmacy_orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) NOT NULL,
  `status` varchar(20) DEFAULT 'Pending',
  `delivery_address` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pharmacy_orders`
--

INSERT INTO `pharmacy_orders` (`order_id`, `user_id`, `order_date`, `total_amount`, `status`, `delivery_address`) VALUES
(1, 3, '2026-01-19 15:08:39', 15.00, 'Pending', 'Default Address');

-- --------------------------------------------------------

--
-- Table structure for table `pharmacy_order_items`
--

CREATE TABLE `pharmacy_order_items` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `medicine_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pharmacy_order_items`
--

INSERT INTO `pharmacy_order_items` (`order_item_id`, `order_id`, `medicine_id`, `quantity`, `price`) VALUES
(1, 1, 1, 3, 5.00);

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `room_id` int(11) NOT NULL,
  `room_name` varchar(100) NOT NULL,
  `room_type` varchar(50) NOT NULL,
  `capacity` int(11) NOT NULL,
  `price_per_day` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `amenities` text DEFAULT NULL,
  `rating` decimal(3,1) DEFAULT 5.0,
  `reviews` int(11) DEFAULT 0,
  `is_available` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`room_id`, `room_name`, `room_type`, `capacity`, `price_per_day`, `description`, `amenities`, `rating`, `reviews`, `is_available`) VALUES
(1, 'General Cabin', 'Cabin', 1, 1500.00, 'Comfortable single cabin with basic medical amenities and nursing care', 'AC,TV,Private Bathroom,Nursing Care,24/7 Monitoring', 4.8, 156, 1),
(2, 'Deluxe Cabin', 'Cabin', 2, 2500.00, 'Spacious cabin with premium and dedicated nursing care', 'AC,TV,Private Bathroom,Nursing Care,24/7 Monitoring,Mini Fridge', 4.9, 234, 1),
(3, 'ICU Cabin', 'ICU', 1, 8000.00, 'Intensive care unit with advanced medical monitoring and life support', '24/7 Monitoring,Medical Equipment,Private Nurse,Emergency Support,Ventilator', 5.0, 67, 1),
(4, 'Semi-Private Ward', 'Ward', 2, 1200.00, 'Shared ward with basic medical amenities and nursing care', 'AC,Shared Bathroom,Nursing Care,Medical Monitoring', 4.5, 312, 1),
(5, 'General Ward', 'Ward', 6, 800.00, 'Shared ward with basic amenities and nursing care for multiple patients', 'AC,Shared Bathroom,Nursing Care,Basic Monitoring', 4.3, 445, 1),
(6, 'General Cabin', 'Cabin', 1, 1500.00, 'Comfortable single cabin with basic medical amenities and nursing care', 'AC,TV,Private Bathroom,Nursing Care,24/7 Monitoring', 4.8, 156, 1),
(7, 'Deluxe Cabin', 'Cabin', 2, 2500.00, 'Spacious cabin with premium and dedicated nursing care', 'AC,TV,Private Bathroom,Nursing Care,24/7 Monitoring,Mini Fridge', 4.9, 234, 1),
(8, 'ICU Cabin', 'ICU', 1, 8000.00, 'Intensive care unit with advanced medical monitoring and life support', '24/7 Monitoring,Medical Equipment,Private Nurse,Emergency Support,Ventilator', 5.0, 67, 1),
(9, 'Semi-Private Ward', 'Ward', 2, 1200.00, 'Shared ward with basic medical amenities and nursing care', 'AC,Shared Bathroom,Nursing Care,Medical Monitoring', 4.5, 312, 1),
(10, 'General Ward', 'Ward', 6, 800.00, 'Shared ward with basic amenities and nursing care for multiple patients', 'AC,Shared Bathroom,Nursing Care,Basic Monitoring', 4.3, 445, 1);

-- --------------------------------------------------------

--
-- Table structure for table `room_bookings`
--

CREATE TABLE `room_bookings` (
  `booking_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `admission_date` date NOT NULL,
  `duration_days` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` varchar(20) DEFAULT 'Confirmed',
  `booking_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_bookings`
--

INSERT INTO `room_bookings` (`booking_id`, `user_id`, `room_id`, `admission_date`, `duration_days`, `total_price`, `status`, `booking_date`) VALUES
(0, 3, 1, '2026-01-20', 3, 4500.00, 'Confirmed', '2026-01-19 14:51:41'),
(0, 3, 1, '2026-01-20', 3, 4500.00, 'Confirmed', '2026-01-19 14:52:11'),
(410738, 3, 1, '2026-01-20', 3, 4500.00, 'Confirmed', '2026-01-19 14:53:30'),
(895683, 3, 5, '2026-01-28', 14, 11200.00, 'Confirmed', '2026-01-19 14:57:51'),
(130311, 3, 1, '2026-01-20', 1, 1500.00, 'Confirmed', '2026-01-19 14:58:59');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `phone`, `address`) VALUES
(3, 'Test@1234', 'Test@1234', 'Test@1234');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`appointment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `department_id` (`department_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_id`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`login_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `medicines`
--
ALTER TABLE `medicines`
  ADD PRIMARY KEY (`medicine_id`);

--
-- Indexes for table `pharmacy_orders`
--
ALTER TABLE `pharmacy_orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `pharmacy_order_items`
--
ALTER TABLE `pharmacy_order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `medicine_id` (`medicine_id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`room_id`);

--
-- Indexes for table `room_bookings`
--
ALTER TABLE `room_bookings`
  ADD KEY `room_bookings_ibfk_1` (`user_id`),
  ADD KEY `room_bookings_ibfk_2` (`room_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `appointment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `login_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `medicines`
--
ALTER TABLE `medicines`
  MODIFY `medicine_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `pharmacy_orders`
--
ALTER TABLE `pharmacy_orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pharmacy_order_items`
--
ALTER TABLE `pharmacy_order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `room_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`);

--
-- Constraints for table `login`
--
ALTER TABLE `login`
  ADD CONSTRAINT `login_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `pharmacy_orders`
--
ALTER TABLE `pharmacy_orders`
  ADD CONSTRAINT `pharmacy_orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `pharmacy_order_items`
--
ALTER TABLE `pharmacy_order_items`
  ADD CONSTRAINT `pharmacy_order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `pharmacy_orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pharmacy_order_items_ibfk_2` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`medicine_id`);

--
-- Constraints for table `room_bookings`
--
ALTER TABLE `room_bookings`
  ADD CONSTRAINT `room_bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `room_bookings_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
