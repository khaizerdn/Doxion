-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 25, 2025 at 11:52 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `doxionv2`
--

-- --------------------------------------------------------

--
-- Table structure for table `activitylogs`
--

CREATE TABLE `activitylogs` (
  `id` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `recipientEmail` varchar(255) NOT NULL,
  `note` text NOT NULL,
  `lockerNumber` varchar(50) NOT NULL,
  `otp` varchar(6) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_received` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activitylogs`
--

INSERT INTO `activitylogs` (`id`, `email`, `recipientEmail`, `note`, `lockerNumber`, `otp`, `created_at`, `date_received`) VALUES
('291823987712', 'cc.khaizer.noguera@cvsu.edu.ph', 'cc.marklawrence.lindo@cvsu.edu.ph', '123123', '1', '870882', '2025-03-24 11:38:48', '2025-03-24 11:40:25');

-- --------------------------------------------------------

--
-- Table structure for table `espdetected_logs`
--

CREATE TABLE `espdetected_logs` (
  `id` bigint(20) NOT NULL,
  `device_name` varchar(255) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `locks` varchar(50) DEFAULT NULL,
  `leds` varchar(50) DEFAULT NULL,
  `detected_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `espdetected_logs`
--

INSERT INTO `espdetected_logs` (`id`, `device_name`, `ip_address`, `locks`, `leds`, `detected_at`) VALUES
(3102721248256, 'A_ESP8266_82768d', '192.168.1.191', 'LockA', 'LedA', '2025-03-24 11:36:17'),
(3103274896384, 'B_ESP8266_82768d', '192.168.1.191', 'LockB', 'LedB', '2025-03-24 11:36:17'),
(3103815961600, 'C_ESP8266_82768d', '192.168.1.191', 'LockC', 'LedC', '2025-03-24 11:36:17'),
(3104327666688, 'D_ESP8266_82768d', '192.168.1.191', 'LockD', 'LedD', '2025-03-24 11:36:17');

-- --------------------------------------------------------

--
-- Table structure for table `lockers`
--

CREATE TABLE `lockers` (
  `id` varchar(255) NOT NULL,
  `number` varchar(50) NOT NULL,
  `device_name` varchar(100) DEFAULT NULL,
  `ip_address` varchar(15) DEFAULT NULL,
  `locks` varchar(50) DEFAULT NULL,
  `leds` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lockers`
--

INSERT INTO `lockers` (`id`, `number`, `device_name`, `ip_address`, `locks`, `leds`, `created_at`) VALUES
('3235680685056', '1', 'A_ESP8266_82768d', '192.168.1.191', 'LockA', 'LedA', '2025-03-24 11:36:49'),
('3305088027648', '2', 'B_ESP8266_82768d', '192.168.1.191', 'LockB', 'LedB', '2025-03-24 11:37:05'),
('3329414990848', '3', 'C_ESP8266_82768d', '192.168.1.191', 'LockC', 'LedC', '2025-03-24 11:37:11'),
('3352844372992', '4', 'D_ESP8266_82768d', '192.168.1.191', 'LockD', 'LedD', '2025-03-24 11:37:17');

-- --------------------------------------------------------

--
-- Table structure for table `recipients`
--

CREATE TABLE `recipients` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `title` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recipients`
--

INSERT INTO `recipients` (`id`, `email`, `name`, `title`, `image`, `created_at`) VALUES
(1558183409664, 'cc.kristine.bulawan@cvsu.edu.ph', 'Kristine Bulawan', 'Professor', 'https://i.pinimg.com/736x/b2/d7/c5/b2d7c59703e43479b6494126df26b271.jpg', '2025-03-11 10:54:01'),
(3410485419008, 'cc.sebastianjerome.parilla@cvsu.edu.ph', 'Sebastian Jerome', 'OJT Coordinator', 'https://upload.wikimedia.org/wikipedia/en/d/d5/Professor_%28Money_Heist%29.jpg', '2025-03-19 07:15:26'),
(3655629904896, 'cc.carlo.gallego@cvsu.edu.ph', 'Carlo G. Gallego', 'Dean', 'https://static.wikia.nocookie.net/money-heist/images/c/ca/Nairobi_-_part_5_volume_2_poster.jpg', '2025-03-19 07:16:25'),
(10574184657920, 'cc.marklawrence.lindo@cvsu.edu.ph', 'Dr. Mark Lawrence', 'Engineer', 'https://mir-s3-cdn-cf.behance.net/project_modules/fs/26690f96860207.5eb83091ee6d2.jpg', '2025-03-14 09:33:58'),
(15478728950784, 'cc.khaizer.noguera@cvsu.edu.ph', 'Engr. Khaizer Noguera', 'Professor', 'https://static.wikia.nocookie.net/money-heist/images/e/ee/Bogot%C3%A1_-_part_5_volume_2_poster.jpg', '2025-03-14 08:02:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `pin` char(6) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `pin`, `created_at`, `updated_at`) VALUES
(2147483647, 'cc.marklawrence.lindo@cvsu.edu.ph', '123123', '2025-03-14 09:32:14', '2025-03-14 09:32:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activitylogs`
--
ALTER TABLE `activitylogs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `espdetected_logs`
--
ALTER TABLE `espdetected_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lockers`
--
ALTER TABLE `lockers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `number` (`number`);

--
-- Indexes for table `recipients`
--
ALTER TABLE `recipients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2147483648;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
