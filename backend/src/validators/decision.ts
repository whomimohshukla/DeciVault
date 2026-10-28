import { z } from 'zod';

export const decisionStatusSchema = z.enum(['PROPOSED', 'APPROVED', 'REJECTED', 'SUPERSEDED']);

export const createDecisionSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().min(1, 'Description is required').max(20000),
  problemContext: z.string().trim().max(5000).optional().nullable(),
  rationale: z.string().trim().max(10000).optional().nullable(),
  alternatives: z.string().trim().max(5000).optional().nullable(),
  status: decisionStatusSchema.optional().default('PROPOSED'),
  projectId: z.string().min(1).optional().nullable(),
  ownerId: z.string().min(1).optional().nullable(),
  approverId: z.string().min(1).optional().nullable(),
  decisionDate: z.string().optional().nullable(),
  effectiveDate: z.string().optional().nullable(),
  approvalNotes: z.string().trim().max(5000).optional().nullable(),
  rejectionNotes: z.string().trim().max(5000).optional().nullable(),
});

export const updateDecisionSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200).optional(),
  description: z.string().trim().min(1, 'Description is required').max(20000).optional(),
  problemContext: z.string().trim().max(5000).optional().nullable(),
  rationale: z.string().trim().max(10000).optional().nullable(),
  alternatives: z.string().trim().max(5000).optional().nullable(),
  status: decisionStatusSchema.optional(),
  projectId: z.string().min(1).optional().nullable(),
  ownerId: z.string().min(1).optional().nullable(),
  approverId: z.string().min(1).optional().nullable(),
  decisionDate: z.string().optional().nullable(),
  effectiveDate: z.string().optional().nullable(),
  approvalNotes: z.string().trim().max(5000).optional().nullable(),
  rejectionNotes: z.string().trim().max(5000).optional().nullable(),
});
