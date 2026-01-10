/*
  Warnings:

  - A unique constraint covering the columns `[shareCode]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiresAt` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shareCode` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'User');

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "content" TEXT,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "shareCode" TEXT NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "url" DROP NOT NULL,
ALTER COLUMN "size" SET DEFAULT 0,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER',
ADD COLUMN     "usedStorage" BIGINT NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "File_shareCode_key" ON "File"("shareCode");
