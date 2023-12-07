/*
  Warnings:

  - You are about to drop the column `rf_hash` on the `User` table. All the data in the column will be lost.
  - Added the required column `rt_hash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "rf_hash",
ADD COLUMN     "rt_hash" TEXT NOT NULL;
