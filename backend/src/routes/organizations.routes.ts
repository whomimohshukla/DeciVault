import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireOrgMember, requireOrgRole } from '../middleware/orgAccess.js';
import { create, list, get, update, remove } from '../modules/organizations/organizations.controller.js';
import { list as listMembers, updateRole, remove as removeMember, leave } from '../modules/organizations/members.controller.js';
import { invite, list as listInvitations, accept, decline, cancel } from '../modules/organizations/invitations.controller.js';
import {
  create as createProject,
  list as listProjects,
  get as getProject,
  update as updateProject,
  remove as removeProject,
} from '../modules/projects/projects.controller.js';
import {
  create as createDecision,
  list as listDecisions,
  get as getDecision,
  update as updateDecision,
  remove as removeDecision,
  listEvidence,
  addEvidence,
  removeEvidence,
  listHistory,
  listRelationships,
  addRelationship,
  removeRelationship,
} from '../modules/decisions/decisions.controller.js';
import {
  create as createDocument,
  list as listDocuments,
  get as getDocument,
  download as downloadDocument,
  remove as removeDocument,
} from '../modules/documents/documents.controller.js';

const router = Router();

router.post('/', requireAuth, create);
router.get('/', requireAuth, list);

// Invitations (token based, require auth)
router.post('/invitations/:token/accept', requireAuth, accept);
router.post('/invitations/:token/decline', requireAuth, decline);

router.get('/:organizationId', requireAuth, requireOrgMember, get);
router.patch('/:organizationId', requireAuth, requireOrgMember, requireOrgRole(['OWNER']), update);
router.delete('/:organizationId', requireAuth, requireOrgMember, requireOrgRole(['OWNER']), remove);

router.get('/:organizationId/members', requireAuth, requireOrgMember, listMembers);
router.patch('/:organizationId/members/:userId', requireAuth, requireOrgMember, requireOrgRole(['OWNER']), updateRole);
router.delete('/:organizationId/members/:userId', requireAuth, requireOrgMember, requireOrgRole(['OWNER']), removeMember);
router.post('/:organizationId/leave', requireAuth, requireOrgMember, leave);

router.post('/:organizationId/invitations', requireAuth, requireOrgMember, requireOrgRole(['OWNER', 'ADMIN']), invite);
router.get('/:organizationId/invitations', requireAuth, requireOrgMember, requireOrgRole(['OWNER', 'ADMIN']), listInvitations);
router.delete('/:organizationId/invitations/:invitationId', requireAuth, requireOrgMember, requireOrgRole(['OWNER', 'ADMIN']), cancel);

// Projects
router.post('/:organizationId/projects', requireAuth, requireOrgMember, requireOrgRole(['OWNER', 'ADMIN', 'MEMBER']), createProject);
router.get('/:organizationId/projects', requireAuth, requireOrgMember, listProjects);
router.get('/:organizationId/projects/:projectId', requireAuth, requireOrgMember, getProject);
router.patch('/:organizationId/projects/:projectId', requireAuth, requireOrgMember, requireOrgRole(['OWNER', 'ADMIN', 'MEMBER']), updateProject);
router.delete('/:organizationId/projects/:projectId', requireAuth, requireOrgMember, requireOrgRole(['OWNER', 'ADMIN']), removeProject);

// Documents
router.get('/:organizationId/documents', requireAuth, requireOrgMember, listDocuments);
router.post('/:organizationId/documents', requireAuth, requireOrgMember, requireOrgRole(['OWNER', 'ADMIN', 'MEMBER']), createDocument);
router.get('/:organizationId/documents/:documentId', requireAuth, requireOrgMember, getDocument);
router.get('/:organizationId/documents/:documentId/download', requireAuth, requireOrgMember, downloadDocument);
router.delete('/:organizationId/documents/:documentId', requireAuth, requireOrgMember, requireOrgRole(['OWNER', 'ADMIN']), removeDocument);

// Decisions
router.post('/:organizationId/decisions', requireAuth, requireOrgMember, requireOrgRole(['OWNER', 'ADMIN', 'MEMBER']), createDecision);
router.get('/:organizationId/decisions', requireAuth, requireOrgMember, listDecisions);
router.get('/:organizationId/decisions/:decisionId', requireAuth, requireOrgMember, getDecision);
router.patch('/:organizationId/decisions/:decisionId', requireAuth, requireOrgMember, requireOrgRole(['OWNER', 'ADMIN', 'MEMBER']), updateDecision);
router.delete('/:organizationId/decisions/:decisionId', requireAuth, requireOrgMember, requireOrgRole(['OWNER', 'ADMIN']), removeDecision);
router.get('/:organizationId/decisions/:decisionId/evidence', requireAuth, requireOrgMember, listEvidence);
router.post('/:organizationId/decisions/:decisionId/evidence', requireAuth, requireOrgMember, requireOrgRole(['OWNER', 'ADMIN', 'MEMBER']), addEvidence);
router.delete('/:organizationId/decisions/:decisionId/evidence/:documentId', requireAuth, requireOrgMember, requireOrgRole(['OWNER', 'ADMIN', 'MEMBER']), removeEvidence);
router.get('/:organizationId/decisions/:decisionId/history', requireAuth, requireOrgMember, listHistory);
router.get('/:organizationId/decisions/:decisionId/relationships', requireAuth, requireOrgMember, listRelationships);
router.post('/:organizationId/decisions/:decisionId/relationships', requireAuth, requireOrgMember, requireOrgRole(['OWNER', 'ADMIN', 'MEMBER']), addRelationship);
router.delete('/:organizationId/decisions/:decisionId/relationships/:relatedDecisionId/:relationType', requireAuth, requireOrgMember, requireOrgRole(['OWNER', 'ADMIN', 'MEMBER']), removeRelationship);

export default router;
