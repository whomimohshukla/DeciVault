import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireOrgMember, requireOrgRole } from '../middleware/orgAccess.js';
import { create, list, get, update, remove } from '../modules/organizations/organizations.controller.js';
import { list as listMembers, updateRole, remove as removeMember, leave } from '../modules/organizations/members.controller.js';
import { invite, list as listInvitations, accept, decline, cancel } from '../modules/organizations/invitations.controller.js';

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

export default router;
