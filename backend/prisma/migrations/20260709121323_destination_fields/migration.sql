/*
  Warnings:

  - Added the required column `shortDescription` to the `Destination` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `destination` ADD COLUMN `cancellationPolicy` LONGTEXT NULL,
    ADD COLUMN `checkIn` VARCHAR(20) NULL,
    ADD COLUMN `checkOut` VARCHAR(20) NULL,
    ADD COLUMN `displayOrder` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `heroImage` VARCHAR(191) NULL,
    ADD COLUMN `isPublished` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `maxGuests` INTEGER NOT NULL DEFAULT 2,
    ADD COLUMN `metaDescription` VARCHAR(500) NULL,
    ADD COLUMN `metaTitle` VARCHAR(255) NULL,
    ADD COLUMN `rating` DECIMAL(2, 1) NOT NULL DEFAULT 5.0,
    ADD COLUMN `shortDescription` VARCHAR(500) NOT NULL,
    ADD COLUMN `thumbnail` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Destination_featured_idx` ON `Destination`(`featured`);

-- CreateIndex
CREATE INDEX `Destination_isPublished_idx` ON `Destination`(`isPublished`);

-- CreateIndex
CREATE INDEX `Destination_displayOrder_idx` ON `Destination`(`displayOrder`);
