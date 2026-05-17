-- CreateTable
CREATE TABLE `members` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `login_id` VARCHAR(20) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `birth` VARCHAR(8) NOT NULL,
    `gender` CHAR(1) NOT NULL DEFAULT 'N',
    `address` VARCHAR(255) NOT NULL,
    `red_date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `status` CHAR(1) NOT NULL DEFAULT 'A',
    `point` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `email` VARCHAR(40) NOT NULL,
    `phone_number` VARCHAR(13) NOT NULL,
    `phone_verified` CHAR(1) NOT NULL DEFAULT 'N',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
