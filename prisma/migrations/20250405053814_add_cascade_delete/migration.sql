-- DropForeignKey
ALTER TABLE "Movement" DROP CONSTRAINT "Movement_actionId_fkey";

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;
