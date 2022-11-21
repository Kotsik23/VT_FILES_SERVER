/*
  Warnings:

  - A unique constraint covering the columns `[name,folder]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "File_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "File_name_folder_key" ON "File"("name", "folder");
