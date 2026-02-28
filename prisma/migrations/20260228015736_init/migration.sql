-- AlterTable
ALTER TABLE "Compte" ADD COLUMN     "niveauId" INTEGER;

-- AddForeignKey
ALTER TABLE "Compte" ADD CONSTRAINT "Compte_niveauId_fkey" FOREIGN KEY ("niveauId") REFERENCES "Niveau"("id") ON DELETE SET NULL ON UPDATE CASCADE;
