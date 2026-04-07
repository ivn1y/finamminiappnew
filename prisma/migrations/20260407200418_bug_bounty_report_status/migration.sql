-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BugBountyReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "participantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BugBountyReport_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "BugBountyParticipant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BugBountyReport" ("createdAt", "description", "id", "participantId", "title") SELECT "createdAt", "description", "id", "participantId", "title" FROM "BugBountyReport";
DROP TABLE "BugBountyReport";
ALTER TABLE "new_BugBountyReport" RENAME TO "BugBountyReport";
CREATE INDEX "BugBountyReport_participantId_idx" ON "BugBountyReport"("participantId");
CREATE INDEX "BugBountyReport_createdAt_idx" ON "BugBountyReport"("createdAt");
CREATE INDEX "BugBountyReport_status_idx" ON "BugBountyReport"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
