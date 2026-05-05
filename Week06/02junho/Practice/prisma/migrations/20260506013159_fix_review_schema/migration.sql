/*
  Warnings:

  - You are about to drop the column `store_id` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `reviews` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_mission_id` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_store_id_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_user_id_fkey`;

-- DropIndex
DROP INDEX `reviews_store_id_fkey` ON `reviews`;

-- DropIndex
DROP INDEX `reviews_user_id_fkey` ON `reviews`;

-- AlterTable
ALTER TABLE `reviews` DROP COLUMN `store_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD COLUMN `user_mission_id` INTEGER NOT NULL,
    MODIFY `rating` DECIMAL(2, 1) NOT NULL;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_user_mission_id_fkey` FOREIGN KEY (`user_mission_id`) REFERENCES `user_missions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
