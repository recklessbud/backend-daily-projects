-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_supervisorId_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "supervisorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
