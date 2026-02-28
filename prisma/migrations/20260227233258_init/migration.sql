/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Niveau` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `code` on the `Niveau` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Niveau" DROP COLUMN "code",
ADD COLUMN     "code" TEXT NOT NULL;

-- DropEnum
DROP TYPE "NiveauCode";

-- CreateIndex
CREATE UNIQUE INDEX "Niveau_code_key" ON "Niveau"("code");
