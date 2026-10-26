import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrganization, listMembers, inviteMember, updateMemberRole, removeMember, leaveOrganization } from '../../services/organizations';
import { useAuth } from '../../context/AuthContext';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Badge } from '@/components/ui/badge';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import { Users, Mail, FolderKanban, ArrowLeft, Plus } from 'lucide-react';

export default function OrganizationDetail() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const { user } = useAuth();
  const [org, setOrg] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const [inviting, setInviting] = useState(false);

  const load = async () => {
    try {
      const [orgRes, memRes] = await Promise.all([
        getOrganization(organizationId!),
        listMembers(organizationId!),
      ]);
      setOrg(orgRes.data.organization);
      setMembers(memRes.data.members || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load organization');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [organizationId]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInviting(true);
    try {
      await inviteMember(organizationId!, { email: inviteEmail, role: inviteRole });
      setInviteEmail('');
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to invite member');
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await updateMemberRole(organizationId!, userId, role);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm('Remove this member from the organization?')) return;
    try {
      await removeMember(organizationId!, userId);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleLeave = async () => {
    if (!confirm('Are you sure you want to leave this organization?')) return;
    try {
      await leaveOrganization(organizationId!);
      window.location.href = '/organizations';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to leave organization');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <LoadingSkeleton className="h-8 w-48" />
          <LoadingSkeleton className="h-32 w-full" />
          <LoadingSkeleton className="h-64 w-full" />
        </div>
      </AppLayout>
    );
  }

  const myMembership = members.find((m: any) => m.user?.id === user?.id);
  const canManage = myMembership?.role === 'OWNER' || myMembership?.role === 'ADMIN';
  const isOwner = myMembership?.role === 'OWNER';

  const getRoleBadgeVariant = (role: string) => {
    if (role === 'OWNER') return 'danger';
    if (role === 'ADMIN') return 'warning';
    if (role === 'MEMBER') return 'info';
    return 'gray';
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/organizations">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">{org?.name}</h1>
              <p className="text-text-secondary mt-1">{org?.slug}</p>
            </div>
          </div>
          <Link to={`/organizations/${organizationId}/projects`}>
            <Button>
              <FolderKanban className="w-4 h-4" />
              View Projects
            </Button>
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Invite Section */}
        {canManage && (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-brand-primary" />
              <h2 className="text-lg font-semibold text-text-primary">Invite Members</h2>
            </div>
            <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  type="email"
                  required
                />
              </div>
              <select
                className="px-3 py-2 bg-white border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
                <option value="VIEWER">Viewer</option>
              </select>
              <Button type="submit" loading={inviting}>
                <Plus className="w-4 h-4" />
                Send Invite
              </Button>
            </form>
          </Card>
        )}

        {/* Members Section */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-brand-primary" />
            <h2 className="text-lg font-semibold text-text-primary">Team Members</h2>
            <Badge variant="gray">{members.length}</Badge>
          </div>
          <div className="space-y-3">
            {members.map((member: any) => (
              <div key={member.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {member.user?.firstName?.[0] || member.user?.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">
                      {member.user?.firstName && member.user?.lastName 
                        ? `${member.user.firstName} ${member.user.lastName}`
                        : member.user?.firstName || 'Unknown User'}
                    </p>
                    <p className="text-sm text-text-secondary">{member.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getRoleBadgeVariant(member.role)}>{member.role}</Badge>
                  {isOwner && member.user?.id !== user?.id && (
                    <div className="flex items-center gap-2">
                      <select
                        className="px-2 py-1 bg-white border border-border rounded text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.user?.id, e.target.value)}
                      >
                        <option value="MEMBER">Member</option>
                        <option value="ADMIN">Admin</option>
                        <option value="VIEWER">Viewer</option>
                        <option value="OWNER">Owner</option>
                      </select>
                      <Button variant="ghost" size="sm" onClick={() => handleRemove(member.user?.id)}>
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text-primary">Leave Organization</h3>
              <p className="text-sm text-text-secondary mt-1">Remove yourself from this organization</p>
            </div>
            <Button variant="destructive" onClick={handleLeave}>
              Leave Organization
            </Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
