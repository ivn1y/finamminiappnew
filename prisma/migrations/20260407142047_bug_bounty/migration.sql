-- CreateTable
CREATE TABLE "BugBountyParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "participantKey" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BugBountyReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "participantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BugBountyReport_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "BugBountyParticipant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "BugBountyParticipant_participantKey_key" ON "BugBountyParticipant"("participantKey");

-- CreateIndex
CREATE INDEX "BugBountyReport_participantId_idx" ON "BugBountyReport"("participantId");

-- CreateIndex
CREATE INDEX "BugBountyReport_createdAt_idx" ON "BugBountyReport"("createdAt");
