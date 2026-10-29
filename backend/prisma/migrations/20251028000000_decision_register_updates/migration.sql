ALTER TYPE "DecisionStatus" RENAME TO "DecisionStatus_old";
CREATE TYPE "DecisionStatus" AS ENUM ('PROPOSED', 'APPROVED', 'REJECTED', 'SUPERSEDED');

ALTER TABLE "Decision" ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Decision"
  ALTER COLUMN "status" TYPE "DecisionStatus"
  USING CASE
    WHEN "status"::text = 'PROPOSED' THEN 'PROPOSED'::"DecisionStatus"
    WHEN "status"::text = 'APPROVED' THEN 'APPROVED'::"DecisionStatus"
    WHEN "status"::text = 'REJECTED' THEN 'REJECTED'::"DecisionStatus"
    WHEN "status"::text = 'SUPERSEDED' THEN 'SUPERSEDED'::"DecisionStatus"
    WHEN "status"::text = 'ARCHIVED' THEN 'PROPOSED'::"DecisionStatus"
    ELSE 'PROPOSED'::"DecisionStatus"
  END;

ALTER TABLE "Decision" ALTER COLUMN "status" SET DEFAULT 'PROPOSED';

DROP TYPE "DecisionStatus_old";

ALTER TABLE "Decision"
  ADD COLUMN "problemContext" TEXT,
  ADD COLUMN "effectiveDate" TIMESTAMP(3),
  ADD COLUMN "approverId" TEXT,
  ADD COLUMN "archivedAt" TIMESTAMP(3);

CREATE INDEX "Decision_approverId_idx"
  ON "Decision"("approverId");

CREATE INDEX "Decision_effectiveDate_idx"
  ON "Decision"("effectiveDate");

ALTER TABLE "Decision"
  ADD CONSTRAINT "Decision_approverId_fkey"
    FOREIGN KEY ("approverId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
