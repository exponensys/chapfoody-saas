/*
  Warnings:

  - Added the required column `business_id` to the `subscription_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscription_item" ADD COLUMN     "business_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "subscription_item_business_id_idx" ON "subscription_item"("business_id");

-- AddForeignKey
ALTER TABLE "subscription_item" ADD CONSTRAINT "subscription_item_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
