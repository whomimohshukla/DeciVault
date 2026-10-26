import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { listProjects, createProject } from '../../services/projects';
import ChaiNavbar from '../../components/layout/ChaiNavbar';
import { Footer } from '../../components/footer';

export default function ProjectList() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const load = async () => {
    if (!organizationId) return;
    try {
      const res = await listProjects(organizationId);
      setProjects(res.data?.projects || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [organizationId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId) return;
    setError('');
    setCreating(true);
    try {
      await createProject(organizationId, { name, description });
      setName('');
      setDescription('');
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background">
      <ChaiNavbar />
      <main className="pt-32 px-6 max-w-4xl mx-auto text-foreground">Loading...</main>
    </div>
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.08)_0%,transparent_60%)] pointer-events-none" />
      <ChaiNavbar />
      <main className="relative flex-1 max-w-4xl mx-auto px-6 sm:px-12 pt-32 pb-16 w-full">
        <div className="mb-6">
          <Link to={`/organizations/${organizationId}`} className="text-muted-foreground hover:text-foreground text-sm">← Back to Organization</Link>
        </div>
        <h1 className="text-2xl sm:text-3xl font-medium mb-6">Projects</h1>
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleCreate} className="card-chai p-4 mb-6 space-y-2">
          <h2 className="font-semibold">Create Project</h2>
          <input
            className="w-full px-3 py-2 bg-transparent border border-border rounded"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            className="w-full px-3 py-2 bg-transparent border border-border rounded"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button disabled={creating} className="px-4 py-2 bg-white text-black rounded">
            {creating ? 'Creating...' : 'Create'}
          </button>
        </form>
        {projects.length === 0 ? (
          <p className="text-muted-foreground">No projects yet.</p>
        ) : (
          <div className="space-y-2">
            {projects.map((p) => (
              <Link
                key={p.id}
                to={`/organizations/${organizationId}/projects/${p.id}`}
                className="block card-chai p-4 hover:opacity-100"
              >
                <div className="font-semibold">{p.name}</div>
                {p.description && <div className="text-sm text-muted-foreground">{p.description}</div>}
                <div className="text-xs text-muted-foreground mt-1">Status: {p.status}</div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
