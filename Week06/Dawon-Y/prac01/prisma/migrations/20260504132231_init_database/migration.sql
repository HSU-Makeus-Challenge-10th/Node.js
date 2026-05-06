-- CreateTable
CREATE TABLE `member` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NULL,
    `gender` VARCHAR(10) NULL,
    `age` INTEGER NULL,
    `address` VARCHAR(40) NULL,
    `spec_address` VARCHAR(40) NULL,
    `phone_num` VARCHAR(13) NULL,
    `status` VARCHAR(15) NULL,
    `inactive_date` DATETIME(3) NULL,
    `social_type` VARCHAR(10) NULL,
    `email` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,
    `point` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `food_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_prefer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    INDEX `f_category_id`(`category_id`),
    INDEX `user_id`(`member_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `member_prefer` ADD CONSTRAINT `member_prefer_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_prefer` ADD CONSTRAINT `member_prefer_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `food_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
