/*
  Warnings:

  - Added the required column `folder` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimetype` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "folder" TEXT NOT NULL,
ADD COLUMN     "isConcat" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isOverwritten" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSaved" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "mimetype" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
