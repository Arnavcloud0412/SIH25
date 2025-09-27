/*
  Warnings:

  - Added the required column `address` to the `claims` table without a default value. This is not possible if the table is not empty.
  - Added the required column `claimantName` to the `claims` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `claims` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gramPanchayat` to the `claims` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `claims` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tehsilTaluka` to the `claims` table without a default value. This is not possible if the table is not empty.
  - Added the required column `village` to the `claims` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."claims" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "claimantName" TEXT NOT NULL,
ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "familyMembers" JSONB,
ADD COLUMN     "fatherMotherName" TEXT,
ADD COLUMN     "gramPanchayat" TEXT NOT NULL,
ADD COLUMN     "isOtherTraditionalForestDweller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isScheduledTribe" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "spouseName" TEXT,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "tehsilTaluka" TEXT NOT NULL,
ADD COLUMN     "village" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."documents" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "claimId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "password" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
