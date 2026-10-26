import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listOrganizations, createOrganization } from '../../services/organizations';

export default function OrganizationList() {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      const res = await listOrganizations();
      setOrgs(res.data.organizations || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCreating(true);
    try {
      await createOrganization({ name, slug });
      setName('');
      setSlug('');
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Organizations</h1>
        {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-6 space-y-2">
          <h2 className="font-semibold">Create Organization</h2>
          <input
            className="w-full px-3 py-2 border rounded"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="w-full px-3 py-2 border rounded"
            placeholder="Slug (e.g., my-org)"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase())}
            required
          />
          <button disabled={creating} className="px-4 py-2 bg-blue-600 text-white rounded">
            {creating ? 'Creating...' : 'Create'}
          </button>
        </form>
        {orgs.length === 0 ? (
          <p>No organizations yet.</p>
        ) : (
          <div className="space-y-2">
            {orgs.map((org) => (
              <Link
                key={org.id}
                to={`/organizations/${org.id}`}
                className="block bg-white p-4 rounded shadow hover:bg-gray-50"
              >
                <div className="font-semibold">{org.name}</div>
                <div className="text-sm text-gray-600">{org.slug} • Role: {org.role}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
