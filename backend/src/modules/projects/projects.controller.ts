import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { createProjectSchema, updateProjectSchema } from '../../validators/project.js';
import {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
} from './projects.service.js';

export async function create(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    const organizationId = req.params.organizationId as string;
    const parsed = createProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: parsed.error.flatten(),
      });
    }
    const project = await createProject(req.userId, organizationId, parsed.data);
    return res.status(201).json({ status: 'success', data: { project } });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: 'Failed to create project' });
  }
}

export async function list(req: AuthRequest, res: Response) {
  try {
    const organizationId = req.params.organizationId as string;
    const projects = await listProjects(organizationId);
    return res.status(200).json({ status: 'success', data: { projects } });
  } catch {
    return res.status(500).json({ status: 'error', message: 'Failed to list projects' });
  }
}

export async function get(req: AuthRequest, res: Response) {
  try {
    const organizationId = req.params.organizationId as string;
    const projectId = req.params.projectId as string;
    const project = await getProject(organizationId, projectId);
    if (!project) {
      return res.status(404).json({ status: 'error', message: 'Project not found' });
    }
    return res.status(200).json({ status: 'success', data: { project } });
  } catch {
    return res.status(500).json({ status: 'error', message: 'Failed to get project' });
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const organizationId = req.params.organizationId as string;
    const projectId = req.params.projectId as string;
    const parsed = updateProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: parsed.error.flatten(),
      });
    }
    const project = await updateProject(organizationId, projectId, parsed.data);
    return res.status(200).json({ status: 'success', data: { project } });
  } catch (error: any) {
    if (error.message === 'Forbidden') {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
    return res.status(500).json({ status: 'error', message: 'Failed to update project' });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    const organizationId = req.params.organizationId as string;
    const projectId = req.params.projectId as string;
    await deleteProject(organizationId, projectId);
    return res.status(200).json({ status: 'success', message: 'Project deleted' });
  } catch (error: any) {
    if (error.message === 'Not found') {
      return res.status(404).json({ status: 'error', message: 'Project not found' });
    }
    return res.status(500).json({ status: 'error', message: 'Failed to delete project' });
  }
}
