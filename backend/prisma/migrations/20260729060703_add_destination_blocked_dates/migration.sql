-- CreateTable
CREATE TABLE `DestinationBlockedDate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `destinationId` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `reason` VARCHAR(200) NULL,

    INDEX `DestinationBlockedDate_destinationId_idx`(`destinationId`),
    UNIQUE INDEX `DestinationBlockedDate_destinationId_date_key`(`destinationId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DestinationBlockedDate` ADD CONSTRAINT `DestinationBlockedDate_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `Destination`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
