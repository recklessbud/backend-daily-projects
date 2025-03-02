/*
  Warnings:

  - You are about to drop the column `title` on the `Project` table. All the data in the column will be lost.
  - Added the required column `fileKey` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileName` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileUrl` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "title",
ADD COLUMN     "fileKey" TEXT NOT NULL,
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "fileUrl" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
