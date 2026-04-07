-- AlterTable
ALTER TABLE "BugBountyParticipant" ADD COLUMN "passwordHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "BugBountyParticipant_email_key" ON "BugBountyParticipant"("email");
