-- CreateTable
CREATE TABLE "BugBountyAttachmentBlob" (
    "fileId" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "data" BLOB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BugBountyAttachmentBlob_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "BugBountyReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "BugBountyAttachmentBlob_reportId_idx" ON "BugBountyAttachmentBlob"("reportId");
