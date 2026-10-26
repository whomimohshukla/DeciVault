import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProject, updateProject, deleteProject } from '../../services/projects';
import ChaiNavbar from '../../components/layout/ChaiNavbar';
import { Footer } from '../../components/footer';

export default function ProjectDetail() {
  const { organizationId, projectId } = useParams<{ organizationId: string; projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    if (!organizationId || !projectId) return;
    try {
      const res = await getProject(organizationId, projectId);
      const p = res.data?.project;
      setProject(p);
      setName(p.name);
      setDescription(p.description || '');
      setStatus(p.status);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [organizationId, projectId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId || !projectId) return;
    setSaving(true);
    setError('');
    try {
      await updateProject(organizationId, projectId, { name, description: description || null, status });
      await load();
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!organizationId || !projectId) return;
    if (!confirm('Delete this project?')) return;
    setDeleting(true);
    setError('');
    try {
      await deleteProject(organizationId, projectId);
      navigate(`/organizations/${organizationId}/projects`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete project');
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background">
      <ChaiNavbar />
      <main className="pt-32 px-6 max-w-4xl mx-auto text-foreground">Loading...</main>
    </div>
  );

  if (!project) return (
    <div className="min-h-screen bg-background">
      <ChaiNavbar />
      <main className="pt-32 px-6 max-w-4xl mx-auto text-foreground">Project not found</main>
    </div>
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.08)_0%,transparent_60%)] pointer-events-none" />
      <ChaiNavbar />
      <main className="relative flex-1 max-w-4xl mx-auto px-6 sm:px-12 pt-32 pb-16 w-full">
        <div className="mb-6">
          <Link to={`/organizations/${organizationId}/projects`} className="text-muted-foreground hover:text-foreground text-sm">← Back to Projects</Link>
        </div>
        <h1 className="text-2xl sm:text-3xl font-medium mb-6">{project.name}</h1>
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded mb-4">{error}</div>}
        {!editing ? (
          <div className="card-chai p-6 space-y-3">
            <div>
              <div className="text-muted-foreground text-sm">Description</div>
              <div>{project.description || 'No description'}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-sm">Status</div>
              <div>{project.status}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-sm">Created By</div>
              <div>{project.createdBy?.firstName || project.createdBy?.email}</div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setEditing(true)} className="px-4 py-2 bg-white text-black rounded">Edit</button>
              <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 border border-red-500/40 text-red-400 rounded">
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="card-chai p-6 space-y-3">
            <input
              className="w-full px-3 py-2 bg-transparent border border-border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <textarea
              className="w-full px-3 py-2 bg-transparent border border-border rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select
              className="px-3 py-2 bg-transparent border border-border rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="ON_HOLD">ON_HOLD</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
            <div className="flex gap-2">
              <button disabled={saving} className="px-4 py-2 bg-white text-black rounded">
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 border border-border rounded">Cancel</button>
            </div>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
