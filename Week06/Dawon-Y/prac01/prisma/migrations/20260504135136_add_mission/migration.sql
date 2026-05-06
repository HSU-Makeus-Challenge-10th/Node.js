-- CreateTable
CREATE TABLE `mission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `store_id` INTEGER NULL,
    `reward` INTEGER NULL,
    `deadline` DATETIME(3) NULL,
    `mission_spec` TEXT NULL,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    INDEX `store_id`(`store_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mission` ADD CONSTRAINT `mission_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `store`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
