-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_templateId_fkey";

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
