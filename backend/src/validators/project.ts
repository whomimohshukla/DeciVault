import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(2000).optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'ON_HOLD']).optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(2000).optional().nullable(),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'ON_HOLD']).optional(),
});
