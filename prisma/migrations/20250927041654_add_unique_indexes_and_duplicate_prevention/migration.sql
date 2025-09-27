/*
  Warnings:

  - A unique constraint covering the columns `[userId,claimantName,village,district,state]` on the table `claims` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[claimantName,fatherMotherName,village,district]` on the table `claims` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "user_status_index" ON "public"."claims"("userId", "status");

-- CreateIndex
CREATE INDEX "location_index" ON "public"."claims"("district", "state");

-- CreateIndex
CREATE INDEX "status_created_index" ON "public"."claims"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "claims_userId_claimantName_village_district_state_key" ON "public"."claims"("userId", "claimantName", "village", "district", "state");

-- CreateIndex
CREATE UNIQUE INDEX "claims_claimantName_fatherMotherName_village_district_key" ON "public"."claims"("claimantName", "fatherMotherName", "village", "district");
