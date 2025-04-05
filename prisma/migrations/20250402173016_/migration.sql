/*
  Warnings:

  - You are about to drop the column `count` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Action` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Action" DROP COLUMN "count",
DROP COLUMN "weight";

-- CreateTable
CREATE TABLE "Movement" (
    "id" SERIAL NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "reps" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "actionId" INTEGER NOT NULL,

    CONSTRAINT "Movement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Movement_weight_idx" ON "Movement"("weight");

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
