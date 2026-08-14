-- CreateTable
CREATE TABLE `ContactMessage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `destination` VARCHAR(150) NULL,
    `travelDate` DATETIME(3) NULL,
    `guests` INTEGER NULL,
    `budget` VARCHAR(50) NULL,
    `subject` VARCHAR(200) NULL,
    `message` LONGTEXT NOT NULL,
    `status` ENUM('NEW', 'READ', 'RESPONDED') NOT NULL DEFAULT 'NEW',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ContactMessage_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmailLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `toEmail` VARCHAR(150) NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `status` ENUM('SENT', 'FAILED') NOT NULL,
    `errorMessage` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `EmailLog_status_idx`(`status`),
    INDEX `EmailLog_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
