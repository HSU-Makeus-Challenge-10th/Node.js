/*
  Warnings:

  - You are about to drop the column `owner_number` on the `stores` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `stores` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(20)`.
  - You are about to alter the column `category` on the `stores` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(20)`.
  - Added the required column `address` to the `stores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `stores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stores` DROP COLUMN `owner_number`,
    ADD COLUMN `address` VARCHAR(50) NOT NULL,
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `status` VARCHAR(20) NOT NULL,
    MODIFY `name` VARCHAR(20) NOT NULL,
    MODIFY `category` VARCHAR(20) NOT NULL;
