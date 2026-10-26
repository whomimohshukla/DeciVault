-- Create enums
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'ON_HOLD');
CREATE TYPE "DocumentProcessingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
CREATE TYPE "DecisionStatus" AS ENUM ('PROPOSED', 'APPROVED', 'REJECTED', 'SUPERSEDED', 'ARCHIVED');
CREATE TYPE "AssumptionStatus" AS ENUM ('ACTIVE', 'CONFIRMED', 'INVALIDATED', 'ARCHIVED');
CREATE TYPE "TaskStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE "IntegrationStatus" AS ENUM ('CONNECTED', 'DISCONNECTED', 'ERROR');
CREATE TYPE "IntegrationProvider" AS ENUM ('SLACK', 'GITHUB', 'GOOGLE_DRIVE', 'MICROSOFT_TEAMS', 'OTHER');
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');
CREATE TYPE "NotificationType" AS ENUM ('DECISION_UPDATE', 'TASK_ASSIGNED', 'REVIEW_DUE', 'COMMENT', 'MENTION', 'INVITATION', 'SYSTEM');

-- Tables
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "token" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "inviterId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "processingStatus" "DocumentProcessingStatus" NOT NULL DEFAULT 'PENDING',
    "processingError" TEXT,
    "organizationId" TEXT NOT NULL,
    "projectId" TEXT,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DocumentChunk" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DocumentChunk_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Decision" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rationale" TEXT,
    "alternatives" JSONB,
    "risks" JSONB,
    "consequences" JSONB,
    "status" "DecisionStatus" NOT NULL DEFAULT 'PROPOSED',
    "decisionDate" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "approvalNotes" TEXT,
    "rejectionNotes" TEXT,
    "organizationId" TEXT NOT NULL,
    "projectId" TEXT,
    "createdById" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "supersededById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Decision_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DecisionVersion" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "changedById" TEXT NOT NULL,
    "changeSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DecisionVersion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DecisionEvidence" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "documentChunkId" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DecisionEvidence_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DecisionLink" (
    "id" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "relationType" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DecisionLink_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Assumption" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "AssumptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "validationEvidence" TEXT,
    "validatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Assumption_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "outcome" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3),
    "organizationId" TEXT NOT NULL,
    "projectId" TEXT,
    "decisionId" TEXT,
    "createdById" TEXT NOT NULL,
    "assigneeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "decisionId" TEXT,
    "taskId" TEXT,
    "editedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "organizationId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Integration" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "provider" "IntegrationProvider" NOT NULL,
    "status" "IntegrationStatus" NOT NULL DEFAULT 'DISCONNECTED',
    "externalAccountId" TEXT,
    "encryptedConfig" JSONB,
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ConversationMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConversationMessage_pkey" PRIMARY KEY ("id")
);

-- Unique constraints
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");
CREATE UNIQUE INDEX "Membership_userId_organizationId_key" ON "Membership"("userId", "organizationId");
CREATE UNIQUE INDEX "Invitation_token_key" ON "Invitation"("token");
CREATE UNIQUE INDEX "Document_storageKey_key" ON "Document"("storageKey");
CREATE UNIQUE INDEX "DocumentChunk_documentId_chunkIndex_key" ON "DocumentChunk"("documentId", "chunkIndex");
CREATE UNIQUE INDEX "Decision_supersededById_key" ON "Decision"("supersededById");
CREATE UNIQUE INDEX "DecisionVersion_decisionId_version_key" ON "DecisionVersion"("decisionId", "version");
CREATE UNIQUE INDEX "DecisionEvidence_decisionId_documentId_documentChunkId_key" ON "DecisionEvidence"("decisionId", "documentId", "documentChunkId");
CREATE UNIQUE INDEX "DecisionLink_fromId_toId_relationType_key" ON "DecisionLink"("fromId", "toId", "relationType");

-- Indexes
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_status_idx" ON "User"("status");
CREATE INDEX "Organization_slug_idx" ON "Organization"("slug");
CREATE INDEX "Membership_userId_idx" ON "Membership"("userId");
CREATE INDEX "Membership_organizationId_idx" ON "Membership"("organizationId");
CREATE INDEX "Membership_role_idx" ON "Membership"("role");
CREATE INDEX "Invitation_email_idx" ON "Invitation"("email");
CREATE INDEX "Invitation_organizationId_idx" ON "Invitation"("organizationId");
CREATE INDEX "Invitation_token_idx" ON "Invitation"("token");
CREATE INDEX "Invitation_status_idx" ON "Invitation"("status");
CREATE INDEX "Invitation_expiresAt_idx" ON "Invitation"("expiresAt");
CREATE INDEX "Project_organizationId_idx" ON "Project"("organizationId");
CREATE INDEX "Project_createdById_idx" ON "Project"("createdById");
CREATE INDEX "Project_status_idx" ON "Project"("status");
CREATE INDEX "Document_organizationId_idx" ON "Document"("organizationId");
CREATE INDEX "Document_projectId_idx" ON "Document"("projectId");
CREATE INDEX "Document_uploadedById_idx" ON "Document"("uploadedById");
CREATE INDEX "Document_processingStatus_idx" ON "Document"("processingStatus");
CREATE INDEX "Document_createdAt_idx" ON "Document"("createdAt");
CREATE INDEX "DocumentChunk_documentId_idx" ON "DocumentChunk"("documentId");
CREATE INDEX "DocumentChunk_chunkIndex_idx" ON "DocumentChunk"("chunkIndex");
CREATE INDEX "Decision_organizationId_idx" ON "Decision"("organizationId");
CREATE INDEX "Decision_projectId_idx" ON "Decision"("projectId");
CREATE INDEX "Decision_createdById_idx" ON "Decision"("createdById");
CREATE INDEX "Decision_ownerId_idx" ON "Decision"("ownerId");
CREATE INDEX "Decision_status_idx" ON "Decision"("status");
CREATE INDEX "Decision_decisionDate_idx" ON "Decision"("decisionDate");
CREATE INDEX "Decision_createdAt_idx" ON "Decision"("createdAt");
CREATE INDEX "DecisionVersion_decisionId_idx" ON "DecisionVersion"("decisionId");
CREATE INDEX "DecisionVersion_changedById_idx" ON "DecisionVersion"("changedById");
CREATE INDEX "DecisionVersion_createdAt_idx" ON "DecisionVersion"("createdAt");
CREATE INDEX "DecisionEvidence_decisionId_idx" ON "DecisionEvidence"("decisionId");
CREATE INDEX "DecisionEvidence_documentId_idx" ON "DecisionEvidence"("documentId");
CREATE INDEX "DecisionEvidence_documentChunkId_idx" ON "DecisionEvidence"("documentChunkId");
CREATE INDEX "DecisionLink_fromId_idx" ON "DecisionLink"("fromId");
CREATE INDEX "DecisionLink_toId_idx" ON "DecisionLink"("toId");
CREATE INDEX "Assumption_decisionId_idx" ON "Assumption"("decisionId");
CREATE INDEX "Assumption_status_idx" ON "Assumption"("status");
CREATE INDEX "Review_decisionId_idx" ON "Review"("decisionId");
CREATE INDEX "Review_reviewerId_idx" ON "Review"("reviewerId");
CREATE INDEX "Review_scheduledAt_idx" ON "Review"("scheduledAt");
CREATE INDEX "Review_completedAt_idx" ON "Review"("completedAt");
CREATE INDEX "Task_organizationId_idx" ON "Task"("organizationId");
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");
CREATE INDEX "Task_decisionId_idx" ON "Task"("decisionId");
CREATE INDEX "Task_createdById_idx" ON "Task"("createdById");
CREATE INDEX "Task_assigneeId_idx" ON "Task"("assigneeId");
CREATE INDEX "Task_status_idx" ON "Task"("status");
CREATE INDEX "Task_dueDate_idx" ON "Task"("dueDate");
CREATE INDEX "Comment_authorId_idx" ON "Comment"("authorId");
CREATE INDEX "Comment_decisionId_idx" ON "Comment"("decisionId");
CREATE INDEX "Comment_taskId_idx" ON "Comment"("taskId");
CREATE INDEX "Comment_createdAt_idx" ON "Comment"("createdAt");
CREATE INDEX "Notification_recipientId_idx" ON "Notification"("recipientId");
CREATE INDEX "Notification_organizationId_idx" ON "Notification"("organizationId");
CREATE INDEX "Notification_read_idx" ON "Notification"("read");
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");
CREATE INDEX "AuditLog_organizationId_idx" ON "AuditLog"("organizationId");
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
CREATE INDEX "Integration_organizationId_idx" ON "Integration"("organizationId");
CREATE INDEX "Integration_provider_idx" ON "Integration"("provider");
CREATE INDEX "Integration_status_idx" ON "Integration"("status");
CREATE INDEX "Conversation_userId_idx" ON "Conversation"("userId");
CREATE INDEX "Conversation_organizationId_idx" ON "Conversation"("organizationId");
CREATE INDEX "Conversation_createdAt_idx" ON "Conversation"("createdAt");
CREATE INDEX "ConversationMessage_conversationId_idx" ON "ConversationMessage"("conversationId");
CREATE INDEX "ConversationMessage_role_idx" ON "ConversationMessage"("role");
CREATE INDEX "ConversationMessage_createdAt_idx" ON "ConversationMessage"("createdAt");

-- Foreign keys
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Project" ADD CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Document" ADD CONSTRAINT "Document_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Document" ADD CONSTRAINT "Document_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DocumentChunk" ADD CONSTRAINT "DocumentChunk_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_supersededById_fkey" FOREIGN KEY ("supersededById") REFERENCES "Decision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DecisionVersion" ADD CONSTRAINT "DecisionVersion_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "Decision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionVersion" ADD CONSTRAINT "DecisionVersion_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DecisionEvidence" ADD CONSTRAINT "DecisionEvidence_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "Decision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionEvidence" ADD CONSTRAINT "DecisionEvidence_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DecisionEvidence" ADD CONSTRAINT "DecisionEvidence_documentChunkId_fkey" FOREIGN KEY ("documentChunkId") REFERENCES "DocumentChunk"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DecisionLink" ADD CONSTRAINT "DecisionLink_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Decision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionLink" ADD CONSTRAINT "DecisionLink_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Decision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Assumption" ADD CONSTRAINT "Assumption_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "Decision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "Decision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "Decision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "Decision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ConversationMessage" ADD CONSTRAINT "ConversationMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
