SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(14) NOT NULL AUTO_INCREMENT,
  `pid` varchar(120) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(225) COLLATE utf8_unicode_ci NOT NULL,
  `password` char(60) COLLATE utf8_unicode_ci NOT NULL,
  `salt` varchar(225) COLLATE utf8_unicode_ci NOT NULL,
  `username` varchar(225) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(225) COLLATE utf8_unicode_ci NOT NULL,
  `profile_image` varchar(225) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'default_profile_image.png',
  `active` int(1) NOT NULL DEFAULT '1',
  `timestamp` int(14) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `friends` (
  `id` int(14) NOT NULL AUTO_INCREMENT,
  `user_id` int(14) NOT NULL,
  `recipient_id` int(14) NOT NULL,
  `active` int(14) NOT NULL DEFAULT '1',
  `timestamp` int(14) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pid` char(12) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `text` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `media_type` enum('img','vid') CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `media_file` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `poster` int(14) NOT NULL,
  `active` int(1) NOT NULL DEFAULT '1',
  `timestamp` int(14) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `user_login_cookies` (
  `user_id` int(14) NOT NULL,
  `key_pair` char(64) COLLATE utf8_unicode_ci NOT NULL,
  `active` int(1) NOT NULL DEFAULT '1',
  `timestamp` int(14) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id` char(64) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(14) NOT NULL,
  `ip_address` varchar(39) COLLATE utf8_unicode_ci NOT NULL,
  `user_agent` varchar(120) COLLATE utf8_unicode_ci NOT NULL,
  `active` int(1) NOT NULL DEFAULT '1',
  `last_active` int(14) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
