-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 06, 2025 at 06:31 AM
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
-- Database: `final_project`
--
CREATE DATABASE IF NOT EXISTS `final_project` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `final_project`;

-- --------------------------------------------------------

--
-- Table structure for table `businessowner`
--

CREATE TABLE `businessowner` (
  `name` varchar(15) NOT NULL,
  `userName` varchar(50) NOT NULL,
  `psw` varchar(255) NOT NULL,
  `email` varchar(30) NOT NULL,
  `paypalEmail` varchar(100) NOT NULL,
  `phoneNumber` varchar(15) NOT NULL,
  `typeOfUser` varchar(15) NOT NULL,
  `subscriptionType` varchar(15) NOT NULL,
  `businessName` varchar(30) NOT NULL,
  `businessAddress` varchar(100) NOT NULL,
  `description` varchar(500) NOT NULL,
  `status` int(1) UNSIGNED NOT NULL,
  `merchantId` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `businessowner`
--

INSERT INTO `businessowner` (`name`, `userName`, `psw`, `email`, `paypalEmail`, `phoneNumber`, `typeOfUser`, `subscriptionType`, `businessName`, `businessAddress`, `description`, `status`, `merchantId`) VALUES
('adam', 'adam123', '$2a$10$tSCYc8kUq8WAFKsRdLJaZeuX.LV5CQ8/dtjYrA9n2tDBdL0Yjd.Su', 'adamdde0669@gmail.com', 'adam123@business.example.com', '0506610688', 'businessowner', 'basic', 'Accentz', 'city: חולון / street: השומרון', 'Your go-to shop for stylish, trendy, and unique accessories! From everyday essentials to statement pieces, we offer a wide range of items to complement your style and elevate any look.', 1, 'FMW7B5UFQDAPL'),
('adel', 'adel123', '$2a$10$lIujCWWY7qFXGzRqCHr0seK4j.fB9BsG9GB4nBereIXFQ0Al7P8O2', 'adel123@gmail.com', 'adel123@business.example.com', '0552213625', 'businessowner', 'premium', 'AdelKhier', 'city: פקיעין / street: עין אלג\'נאן', 'Your ultimate destination for high-quality tools and equipment! We provide a wide range of hand tools, power tools, and industrial equipment for professionals and DIY enthusiasts alike. Our products a', 1, 'QV23SQRHCRR32'),
('ayal', 'ayal123', '$2a$10$71/HIr7tKrF5zTb4qoGgUeZRyT82Oh88nkcdEjfIcKtdvo/Z22AKC', 'Ayal1701@gmail.com', 'Ayal1701@gmail.com', '0545862872', 'businessowner', 'basic', 'ayalFurnishing', 'city: חיפה / street: חטיבת גולני', 'Transform your space with stylish and functional furniture! From cozy living room sets to elegant dining tables and decor, we offer quality pieces to suit every taste and budget. Create your perfect home with Home Haven Furnishings!', 1, 'DDFDD5D656556'),
('loai', 'loai123', '$2a$10$IxaYtDKlKt4BJQB7tpdzhuqthu1qsWeiNAQKJcUOTeazLH5CqnHtu', 'Loaifadul286@gmail.com', 'loai123@business.example.com', '0525710324', 'businessowner', 'enterprise', 'loaiShoes', 'city: פקיעין (בוקייעה) / street: עין אלבראניה', 'Your ultimate destination for stylish, comfortable, and high-quality footwear! From casual sneakers to elegant formal shoes, we have the perfect pair for every occasion. Step up your style today!', 1, 'QEAJU8PSK84W2'),
('nabil', 'nabil123', '$2a$10$B9ZjV8eMX1/e3XnG486/7uAlWgpTBV8M7alhiv51huFNU0aP/3ogu', 'Fadoolnabil@gmail.com', 'nabil123@business.example.com', '0505662554', 'businessowner', 'basic', 'nabilPetSupplies', 'city: חורפיש / street: חורפיש', 'Your one-stop shop for all your pet\'s needs! From nutritious food and comfy beds to toys and grooming essentials, we offer everything to keep your furry, feathered, or scaled friends happy and healthy.', 1, 'VW9GV3AKY5RFL'),
('raine', 'raine123', '$2b$10$zgkF6eUffe9c5ZujP/PIxuEpfmGpsHuWQklt2oVl1w5GiJndsRhhm', 'taleemaddah@gmail.com', 'raine123@business.example.com', '0507973442', 'businessowner', 'premium', 'KidsClothingShop', 'city: פקיעין (בוקייעה) / street: אלקנדול', 'Discover fun, stylish, and comfortable clothing for kids of all ages at KidsClothingShop! From vibrant everyday wear to special occasion outfits, our collection is designed to keep up with your child’', 1, '9CKNVBKVX66ZW\n'),
('saker', 'saker123', '$2a$10$awLX5Am1wjorE5Wb/TzCMO6sR3b6CkpwdhW5gOfLBKd4O5R3DKKrm', 'saker696@gmail.com', 'talea123@business.example.com', '0548783665', 'admin', 'premium', 'sakerElctra', 'city: פקיעין (בוקייעה) / street: כרם אלבדרא', 'Electra Shop is your one-stop destination for high-quality electronics and home appliances. With a wide range of products from top brands, we bring the latest technology to your doorstep. Our commitme', 1, 'MG44X9L3T5CEE'),
('Talea', 'talea123', '$2b$10$myG2EL1omlyAcBbDuHIx7ehOwbUj8/Qr7QY3RWaIbRqrp1I1LHe9S', 'talee@gmail.com', 'talea123@business.example.com\n\n', '0507973442', 'businessowner', 'enterprise', 'moudleCar', 'city: פקיעין / street: אלשיכונאת', 'A store for realistic miniature toy cars for all ages. A wide variety of quality car models for collectors and play.', 1, 'MG44X9L3T5CEE'),
('wafa', 'wafa123', '$2a$10$5kiIQOOi2QoOdnDadH9/QerBncz0wenLXUsZN.Srq59fERVgAcPnK', 'wafaali159@gmail.com', 'wafa123@business.example.com', '0546332475', 'businessowner', 'premium', 'ProMotion Sports', 'city: ציפורי / street: הפסיפס', 'Your ultimate destination for premium sports gear, apparel, and accessories. From beginners to professionals, we’ve got everything you need to fuel your passion for fitness and performance. Get moving', 1, 'RYZZ4XXGYZ4TU'),
('ward', 'ward123', '$2a$10$PhjvyoLRWUg50moAMbTDu.Ol3mZ4LoPTlkx4a82kYo4FDfG4ntGma', 'Wardaboroken@gmail.com', 'ward123@business.example.com', '0586600306', 'businessowner', 'enterprise', 'Rose\'s Cups', 'city: עספיא / street: שכ הזיתים', ' A charming shop specializing in a curated selection of beautiful, high-quality cups for every occasion. From elegant tea cups and sturdy coffee mugs to unique, handcrafted designs, Rose\'s Cups offers', 1, 'HTTLMDABMAZXN');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `categoryNumber` int(11) NOT NULL,
  `categoryName` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`categoryNumber`, `categoryName`) VALUES
(1, 'Toys'),
(2, 'Clothing'),
(3, 'WorkTools'),
(4, 'Pet Supplies'),
(5, 'Home Styling'),
(6, 'Cleaning'),
(7, 'Shoes'),
(8, 'Sport'),
(9, 'Accessories'),
(10, 'Safety'),
(11, 'Beauty'),
(12, 'Furnishing');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `orderNumber` int(11) NOT NULL,
  `shippingAddress` varchar(50) NOT NULL,
  `orderDate` date NOT NULL,
  `userName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`orderNumber`, `shippingAddress`, `orderDate`, `userName`) VALUES
(84, 'City: בית ג\'ן, Street: עכוב', '2024-11-01', 'foad123'),
(85, 'City: בית ג\'ן, Street: עכוב', '2024-11-01', 'foad123'),
(86, 'City: בית ג\'ן, Street: עכוב', '2024-11-01', 'foad123'),
(87, 'City: תל אביב - יפו, Street: אנכי', '2024-11-29', 'robben123'),
(88, 'City: בית ג\'ן, Street: עכוב', '2024-12-05', 'foad123');

-- --------------------------------------------------------

--
-- Table structure for table `orderscontainsproducts`
--

CREATE TABLE `orderscontainsproducts` (
  `catalogNumber` int(11) NOT NULL,
  `orderNumber` int(11) NOT NULL,
  `orderStatus` varchar(50) NOT NULL,
  `productQuantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderscontainsproducts`
--

INSERT INTO `orderscontainsproducts` (`catalogNumber`, `orderNumber`, `orderStatus`, `productQuantity`) VALUES
(2, 85, 'In preparation', 1),
(6, 85, 'In preparation', 1),
(11, 86, 'Received', 1),
(15, 84, 'Received', 1),
(16, 84, 'Received', 1),
(16, 87, 'Received', 1),
(35, 88, 'Received', 3);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `catalogNumber` int(11) NOT NULL,
  `productName` varchar(70) NOT NULL,
  `amount` int(11) NOT NULL,
  `size` varchar(30) DEFAULT NULL,
  `color` varchar(50) NOT NULL,
  `price` double NOT NULL,
  `picturePath` varchar(255) NOT NULL,
  `categoryNumber` int(11) NOT NULL,
  `userName` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`catalogNumber`, `productName`, `amount`, `size`, `color`, `price`, `picturePath`, `categoryNumber`, `userName`, `description`, `status`) VALUES
(1, 'Mercedes car', 10, '1/18', 'black', 50, '1730211503264.avif', 1, 'talea123', '\r\nA sleek, realistic miniature toy car model inspired by a luxury SUV, featuring detailed design and glossy black finish. Perfect for collectors and kids alike.', 'Active'),
(2, 'Bugatti', 2, '1/18', 'red', 20, '1730210914140.jpeg', 1, 'talea123', '\r\nA highly detailed miniature model of a luxury sports car, featuring a striking red and black design. Perfect for display and collecting.', 'Active'),
(3, 'G-Class', 1, '1/18', 'gray', 50, '1730211146726.webp', 1, 'talea123', 'the new G-Class', 'Active'),
(4, 'lambo', 50, '1/18', 'white', 15, '1730210618764.jpg', 1, 'talea123', 'the new lambo', 'Active'),
(5, 'Mclaren', 7, '1/18', 'Orange', 75, '1730210605053.webp', 1, 'talea123', 'High-detail, realistic miniature of a luxury sports car in vibrant orange and black, crafted with precision for car enthusiasts and collectors. Ideal for display, this model captures the essence of au', 'Active'),
(6, 'Lamborghini Essenza SCV12', 24, '1/24', 'white', 20, '1730499397621.webp', 1, 'talea123', ' A high-detail miniature model of the Lamborghini Essenza SCV12, showcasing its unique aerodynamic design, vibrant white and black color scheme with red accents, and signature 63 number', 'Active'),
(7, 'Kids\' Corduroy Outfit Set', 20, 's', 'dark turquoise', 10, '1730499608266.jpg', 2, 'raine123', 'A stylish and cozy two-piece corduroy outfit for kids, featuring a button-up shirt with front pockets and matching pants with cuffed hems. Perfect for a comfortable yet fashionable look.', 'Active'),
(8, 'Kids\' Corduroy Sherpa Jac', 3, '12 / 14 / ', 'Green', 50, '1730499703605.jpg', 2, 'raine123', 'A warm and stylish kids\' jacket made from soft corduroy material with a cozy sherpa lining. It features a \"Smile More\" patch on the chest, zippered front pockets, and a white inner lining for added co', 'Active'),
(9, 'Baby Button-Up Jumpsuit', 8, '12 / 14 / ', 'Light Brown', 15, '1730499815934.jpg', 2, 'raine123', 'A cozy, long-sleeve baby jumpsuit made from soft, breathable muslin fabric. It features a button-up front, two large chest pockets, and rolled-up cuffs for added style. Ideal for keeping little ones c', 'Active'),
(10, 'Kids\' Corduroy Pants', 10, '10 / 12', 'Light Sage Gree', 17, '1730499904155.jpg', 2, 'raine123', 'Comfortable and stylish corduroy pants for kids, featuring an elastic waistband for easy wear, front button details, and two large pockets for a practical look. Perfect for casual outings or everyday ', 'Active'),
(11, 'Kids\' Quilted Hoodie Jack', 19, '10 / 12 / ', 'Warm Caramel Br', 32, '1730499983926.jpg', 2, 'raine123', 'A cozy and stylish quilted hoodie jacket for kids, featuring a full zip front, ribbed cuffs, and two front pockets. The textured fabric adds warmth and a unique look, making it perfect for cool weathe', 'Active'),
(12, 'Stanley Travel Tumbler', 12, '', 'Light Pastel Bl', 18, '1730500773004.jpg', 5, 'ward123', ' A durable, insulated travel tumbler designed to keep your beverages hot or cold for hours. It features a sturdy lid with a flip-top straw and a sleek, ergonomic shape for easy handling. Ideal for adv', 'Active'),
(13, 'Double-Walled Glass Coffe', 10, '', 'Clear Transpare', 9, '1730501059756.jpg', 5, 'ward123', 'A stylish, double-walled glass mug designed to keep your hot drinks warm and your cold drinks cool while preventing condensation. The transparent glass offers a clear view of your beverage, making it ', 'Active'),
(14, 'Mickey Mouse Ceramic Mug', 50, '', 'Red with a blac', 15, '1730501160213.jpg', 5, 'ward123', 'A vibrant ceramic mug featuring the iconic Mickey Mouse design. With its bold red exterior and playful Mickey illustration, this mug is perfect for Disney fans and adds a fun touch to your coffee or t', 'Active'),
(15, 'Adventure Carabiner Mug', 6, '', 'Deep Blue with ', 37, '1730501254242.jpg', 5, 'ward123', 'A rugged stainless steel camping mug featuring a mountain and forest graphic, ideal for outdoor enthusiasts. It comes with an orange carabiner handle that allows it to be easily clipped to a backpack,', 'Active'),
(16, 'Bookshelf Illusion Mug', 14, '', 'White with a re', 20, '1730501686249.jpg', 5, 'ward123', 'A unique ceramic mug featuring a 3D illusion design that looks like a bookshelf breaking through the wall. Perfect for book lovers, this mug adds a touch of mystery and creativity to your coffee or te', 'Active'),
(17, 'Makita Cordless Router', 10, '', 'blue', 22, '1732886924994.jpeg', 3, 'adel123', 'A versatile and powerful compact router, ideal for woodworking tasks such as trimming, shaping, and finishing edges. It features a cordless design for increased mobility, precise depth adjustments, and compatibility with 18V batteries, making it a reliable choice for professionals and DIY enthusiasts.', 'Active'),
(18, 'Ryobi Compound Miter Saw', 3, '', 'yellow', 350, '1732887105014.jpeg', 3, 'adel123', 'A high-performance miter saw designed for accurate and versatile cutting tasks. Ideal for woodworking and construction, it features precise angle adjustments, a durable build, and an ergonomic handle for ease of use. Perfect for making bevel cuts, crosscuts, and miter cuts with efficiency and reliability.', 'Active'),
(19, 'DeWalt 18V XR Cordless Na', 9, '', 'yellow', 124, '1732887439050.jpeg', 3, 'adel123', 'A professional-grade nail gun designed for precision and convenience in fastening tasks. Powered by an 18V XR Li-ion battery, it offers cordless freedom, durability, and consistent performance. Ideal for woodworking, framing, and finishing projects, this tool ensures efficient nailing with minimal effort.', 'Active'),
(20, 'DeWalt 20V Max XR Cordles', 2, '', 'yellow', 80, '1732887543531.jpeg', 3, 'adel123', 'A compact and high-performance impact driver designed for heavy-duty fastening and loosening tasks. Powered by a 20V Max XR lithium-ion battery, it delivers maximum torque and speed for efficient operation. With its ergonomic design and brushless motor, it ensures durability and comfort, making it perfect for construction, automotive, and DIY projects.', 'Active'),
(21, 'Festool ETS EC 150/5 EQ R', 5, '', 'Dark gray with ', 50, '1732887676475.jpeg', 3, 'adel123', 'A high-performance sander designed for precise and efficient surface finishing. Its ergonomic and lightweight design ensures comfort during extended use, while the brushless EC-TEC motor delivers consistent power and durability. Ideal for professional woodworking, cabinetry, and finishing projects, this sander ensures a swirl-free finish with optimal dust extraction capabilities.', 'Active'),
(22, 'Rolex Daytona', 2, '', 'Gold case and s', 10000, '1732888993873.jpeg', 9, 'adam123', 'The Rolex Daytona is an iconic luxury chronograph designed for precision and elegance. With its bold green dial, gold finish, and high-performance features, it\'s a symbol of sophistication and functionality. Ideal for collectors and enthusiasts alike.', 'Active'),
(23, 'Gemstone Pendant Necklace', 30, '', 'red , blue , gr', 20, '1732889110474.jpeg', 9, 'adam123', 'A stunning collection of crystal gemstone pendant necklaces, each featuring a unique and vibrant color. These pendants are set in gold-tone hardware and hung on durable black cords, offering a chic and minimalist design. Perfect for adding a pop of color and elegance to any outfit.', 'Active'),
(24, 'Natural Beaded Bracelet', 50, '', 'Light beige wit', 5, '1732889331917.jpeg', 9, 'adam123', 'A minimalist and stylish stretch bracelet featuring a combination of marble-effect and woodgrain-textured beads. Designed to bring a natural and earthy feel to your accessories, it’s lightweight, comfortable, and perfect for everyday wear or layering with other bracelets.', 'Active'),
(25, 'Patek Philippe Grand Comp', 5, '', ' Rich brown all', 1300, '1732889487518.jpeg', 9, 'adam123', 'A masterpiece of luxury watchmaking, the Patek Philippe Grand Complications features intricate detailing, including a perpetual calendar, moon phase display, and day/month apertures. Renowned for its precision, craftsmanship, and timeless elegance, this watch is designed for the discerning collector and connoisseur.', 'Active'),
(26, 'Gold-Tone Stainless Steel', 2, '', 'Polished gold-t', 500, '1732889586128.jpeg', 9, 'adam123', 'A sleek and elegant bracelet crafted from durable stainless steel with a polished gold-tone design. Featuring a secure clasp and a classic link style, this bracelet is perfect for adding a touch of sophistication to any outfit, whether casual or formal.', 'Active'),
(27, 'Cahrrn Outdoor Work Boots', 11, '45', 'Olive green wit', 100, '1732890262885.jpeg', 7, 'loai123', 'Durable and stylish, these Cahrrn outdoor boots are perfect for work or adventure. Featuring a rugged sole for traction, premium leather construction, and comfortable padding for all-day wear. Built to handle tough conditions while keeping you in style.', 'Active'),
(28, 'Nike Air Jordan 1 Retro High OG', 10, '44', 'Black', 500, '1732890364179.jpeg', 7, 'loai123', 'An iconic basketball sneaker combining timeless style with modern performance. The Nike Air Jordan 1 Retro High OG features a classic colorway with premium leather uppers, a high-top silhouette, and the signature Air cushioning for comfort and support. Perfect for sneaker enthusiasts and athletes alike.', 'Active'),
(29, 'Adidas Yeezy Boost 350 V2', 5, '41 / 42', 'Gray and beige ', 923, '1732890462527.jpeg', 7, 'loai123', 'The Adidas Yeezy Boost 350 V2 is a modern, stylish sneaker designed for both comfort and performance. Featuring a Primeknit upper, Boost cushioning technology, and a signature sleek silhouette, it offers a lightweight and breathable fit perfect for everyday wear or standout street style.', 'Active'),
(30, 'Crocodile-Pattern Leather Loafers', 1, '42', 'Glossy black', 230, '1732890753542.jpeg', 7, 'loai123', 'These premium leather loafers feature a luxurious crocodile-pattern design with a sleek, glossy finish. Enhanced with a decorative metal buckle, they offer both sophistication and comfort, making them perfect for formal occasions or upscale casual looks.', 'Active'),
(31, 'Salomon Toundra Pro CSWP Winter Boots', 5, '44 / 45', 'black', 200, '1732890871081.jpeg', 7, 'loai123', 'These rugged winter boots from Salomon are built for extreme cold-weather conditions. Featuring ClimaSalomon waterproof technology, advanced insulation, and a durable outsole for superior traction on snow and ice, they offer unmatched warmth, comfort, and performance. Perfect for outdoor adventures or demanding winter work environments.', 'Active'),
(32, 'Ballistyx Speed Jump Rope', 50, '', 'black', 20, '1732891532940.jpeg', 8, 'wafa123', 'A premium speed jump rope designed for high-performance workouts, including CrossFit, cardio, and endurance training. Featuring lightweight handles with a comfortable grip and a tangle-free cable, it\'s perfect for improving agility, coordination, and fitness. Adjustable length for all users.', 'Active'),
(33, 'X-Trail Mountain Bike', 3, '', 'White with black accents', 5000, '1732891606446.jpeg', 8, 'wafa123', 'A high-performance mountain bike designed for off-road adventures and rugged terrains. Featuring a lightweight yet durable frame, front suspension for smooth rides, and reliable disc brakes for maximum control. Perfect for outdoor enthusiasts and cycling professionals.', 'Active'),
(34, 'Hex Dumbbells', 0, '12 lbs', 'Black rubber-coated heads with a silver chrome han', 0, '1732891801782.jpeg', 8, 'wafa123', 'Durable and versatile hex dumbbells, ideal for strength training and full-body workouts. The rubber-coated heads protect floors and reduce noise, while the ergonomic chrome handle ensures a comfortable grip. Perfect for home or gym use', 'Active'),
(35, 'Adidas UEFA Champions League Mini Ball', 17, '5', 'White base with blue and teal star patterns', 25, '1732891941184.jpeg', 8, 'wafa123', 'A mini replica of the iconic UEFA Champions League match ball, designed for fun practice sessions and display. Featuring durable construction and vibrant graphics, it’s perfect for soccer fans and collectors alike.', 'Active'),
(36, 'NordicTrack T Series Treadmill', 5, '', 'Black and gray with an LCD console', 999, '1732892005663.jpeg', 8, 'wafa123', 'A high-quality treadmill designed for home fitness. It features adjustable incline, various workout programs, and a sturdy build for a smooth running experience. The interactive display tracks speed, distance, and calories, making it perfect for users of all fitness levels.', 'Active'),
(37, 'Retractable Dog Leash', 5, '', 'red', 7, '1732989836582.jpeg', 4, 'nabil123', 'A durable and easy-to-use retractable dog leash, designed for flexibility and control during walks. Features an ergonomic grip, a secure locking mechanism, and a sturdy metal clip. Perfect for small to medium-sized dogs.', 'Active'),
(38, 'Double Pet Feeding Bowl', 20, '', ' Pink', 13, '1732989901404.jpeg', 4, 'nabil123', 'A stylish and practical double feeding bowl set, perfect for serving food and water simultaneously. Features a durable, non-slip pink base and removable stainless steel bowls for easy cleaning. Ideal for small to medium-sized pets.', 'Active'),
(39, 'Pet Grooming Dematting Tool', 50, '', 'Black and blue', 5, '1732989972234.jpeg', 4, 'nabil123', 'A professional-grade dematting tool designed to gently remove tangles, knots, and loose fur from your pet’s coat. The double-sided stainless steel blades ensure safe and effective grooming, while the ergonomic handle provides a comfortable grip. Perfect for dogs and cats with medium to long hair.', 'Active'),
(40, 'Foldable Pet Playpen', 12, '', 'black', 30, '1732990431885.jpeg', 4, 'nabil123', 'A spacious and durable foldable pet playpen, perfect for indoor and outdoor use. Made of sturdy metal wire with a secure door latch, it provides a safe and comfortable space for your pet to play or rest. Easy to set up, fold, and store.', 'Active'),
(41, 'Premium Dog Toy Set', 20, '', ' Gray', 7, '1732990674483.jpeg', 4, 'nabil123', 'A stylish and durable dog toy set featuring three items: a soft fabric bone, a rope ball with a handle, and a rubber treat-dispensing ball. Perfect for chewing, tugging, and interactive play while promoting mental stimulation and dental health.', 'Active'),
(42, 'Luxury Recliner Chair', 5, '', 'white', 200, '1732992102698.jpeg', 10, 'ayal123', 'A plush and elegant recliner chair, perfect for relaxation and style. Features soft leather upholstery, ergonomic padding, and a smooth swivel base with a wooden finish. Ideal for living rooms, offices, or cozy reading corners.', 'Active'),
(43, 'Classic Chesterfield Sofa', 10, '', 'Rich brown leather', 320, '1732992284234.jpeg', 10, 'ayal123', 'A timeless Chesterfield sofa featuring luxurious tufted leather upholstery, rolled arms, and nailhead trim for an elegant touch. Its sturdy wooden frame and plush cushioning ensure both style and comfort, making it the perfect centerpiece for any living room.', 'Active'),
(44, 'Modern Geometric Nightstand', 2, '', 'Sage green with natural wood legs', 100, '1732992360128.jpeg', 10, 'ayal123', 'A sleek and stylish nightstand featuring a geometric patterned front and a soft sage green finish. With two spacious drawers and sturdy wooden legs, it combines functionality with contemporary design, perfect for modern bedrooms.', 'Active'),
(45, 'Lift-Top Coffee Table', 20, '', 'Walnut wood top with a beige base and black metal ', 183, '1732992448099.jpeg', 10, 'ayal123', 'A modern and functional coffee table with a lift-top design, perfect for maximizing storage and convenience. The walnut finish adds warmth, while the hidden storage compartment keeps essentials like books and remotes organized. Ideal for small spaces and contemporary interiors.', 'Active'),
(46, 'Modern Modular Bookshelf', 12, '', 'Matte dark gray', 845, '1732992660456.jpeg', 10, 'ayal123', 'A sleek and versatile modular bookshelf designed for both style and functionality. Features open shelves for displaying books, decor, and collectibles, along with closed cabinets at the bottom for concealed storage. Perfect for organizing any living room, office, or study space.', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userName` varchar(50) NOT NULL,
  `name` varchar(20) NOT NULL,
  `psw` varchar(255) NOT NULL,
  `email` varchar(30) NOT NULL,
  `preferredCategories` varchar(100) DEFAULT NULL,
  `phoneNumber` varchar(25) DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `profilePicturePath` varchar(255) NOT NULL DEFAULT 'user_profile.jpeg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userName`, `name`, `psw`, `email`, `preferredCategories`, `phoneNumber`, `address`, `profilePicturePath`) VALUES
('foad123', 'foad', '$2a$10$u.EmuMSLeVZ3EUEQF/HzIuKNFJFA8NC8nqTz4kwN9EDW0j1k.9NDi', 'foad123@gmail.com', '[1,2,5]', '0584004330', 'City: בית ג\'ן, Street: עכוב', 'user_profile.jpeg'),
('robben123', 'robben', '$2a$10$h6Ue/xGxSZhMpdMi/DSfKeci7ZPwY/rX4xQMwQ/7awuWRHZHyycza', 'robben123@gmail.com', '[1,8,7,2,3]', '0505052323', 'City: תל אביב - יפו, Street: אנכי', 'user_profile.jpeg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `businessowner`
--
ALTER TABLE `businessowner`
  ADD PRIMARY KEY (`userName`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`categoryNumber`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderNumber`),
  ADD KEY `User_Name` (`userName`);

--
-- Indexes for table `orderscontainsproducts`
--
ALTER TABLE `orderscontainsproducts`
  ADD PRIMARY KEY (`catalogNumber`,`orderNumber`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`catalogNumber`),
  ADD KEY `Category_Number` (`categoryNumber`),
  ADD KEY `User_Name` (`userName`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userName`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `orderNumber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userName`) REFERENCES `users` (`userName`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`categoryNumber`) REFERENCES `categories` (`categoryNumber`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`userName`) REFERENCES `businessowner` (`userName`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
