import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrganization, listMembers, inviteMember, updateMemberRole, removeMember, leaveOrganization } from '../../services/organizations';
import { useAuth } from '../../context/AuthContext';

export default function OrganizationDetail() {
  const { organizationId } = useParams();
  const { user } = useAuth();
  const [org, setOrg] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const [inviteMsg, setInviteMsg] = useState('');

  const load = async () => {
    try {
      const [orgRes, memRes] = await Promise.all([
        getOrganization(organizationId!),
        listMembers(organizationId!),
      ]);
      setOrg(orgRes.data.organization);
      setMembers(memRes.data.members || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [organizationId]);

  const myRole = members.find((m) => m.userId === user?.id)?.role;
  const isOwner = myRole === 'OWNER';
  const isAdminOrOwner = isOwner || myRole === 'ADMIN';

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteMsg('');
    setError('');
    try {
      const res = await inviteMember(organizationId!, { email: inviteEmail, role: inviteRole });
      setInviteMsg(res.data?.token ? `Invitation sent. Token (dev): ${res.data.token}` : 'Invitation sent');
      setInviteEmail('');
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to invite');
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
    if (!confirm('Remove this member?')) return;
    try {
      await removeMember(organizationId!, userId);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove');
    }
  };

  const handleLeave = async () => {
    if (!confirm('Leave this organization?')) return;
    try {
      await leaveOrganization(organizationId!);
      window.location.href = '/organizations';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to leave');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!org) return <div className="p-8">Not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Link to="/organizations" className="text-blue-600 hover:underline">← Back to organizations</Link>
        </div>
        <h1 className="text-3xl font-bold mb-2">{org.name}</h1>
        <p className="text-gray-600 mb-6">{org.slug} • Your role: {myRole}</p>
        {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4">{error}</div>}
        {isAdminOrOwner && (
          <form onSubmit={handleInvite} className="bg-white p-4 rounded shadow mb-6 space-y-2">
            <h2 className="font-semibold">Invite Member</h2>
            {inviteMsg && <div className="bg-green-50 text-green-700 p-2 rounded text-sm break-all">{inviteMsg}</div>}
            <input
              type="email"
              className="w-full px-3 py-2 border rounded"
              placeholder="Email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />
            <select className="px-3 py-2 border rounded" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
              <option value="ADMIN">ADMIN</option>
              <option value="MEMBER">MEMBER</option>
              <option value="VIEWER">VIEWER</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Invite</button>
          </form>
        )}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-semibold mb-4">Members</h2>
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <div>{m.user.firstName || m.user.lastName ? `${m.user.firstName || ''} ${m.user.lastName || ''}`.trim() : m.user.email}</div>
                  <div className="text-sm text-gray-600">{m.user.email} • {m.role}</div>
                </div>
                <div className="space-x-2">
                  {isOwner && m.userId !== user?.id && m.role !== 'OWNER' && (
                    <>
                      <select value={m.role} onChange={(e) => handleRoleChange(m.userId, e.target.value)} className="px-2 py-1 border rounded">
                        <option value="ADMIN">ADMIN</option>
                        <option value="MEMBER">MEMBER</option>
                        <option value="VIEWER">VIEWER</option>
                      </select>
                      <button onClick={() => handleRemove(m.userId)} className="px-2 py-1 bg-red-600 text-white rounded">Remove</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {myRole !== 'OWNER' && (
          <button onClick={handleLeave} className="px-4 py-2 bg-red-600 text-white rounded">Leave Organization</button>
        )}
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
