import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProject, updateProject, deleteProject } from '../../services/projects';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Badge } from '@/components/ui/badge';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import { ArrowLeft, Edit, Trash2, Calendar, User } from 'lucide-react';

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
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
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

  const getStatusVariant = (status: string) => {
    if (status === 'ACTIVE') return 'success';
    if (status === 'ON_HOLD') return 'warning';
    if (status === 'ARCHIVED') return 'gray';
    return 'gray';
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <LoadingSkeleton className="h-8 w-48" />
          <LoadingSkeleton className="h-64 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-text-primary mb-2">Project not found</h2>
          <p className="text-text-secondary mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
          <Link to={`/organizations/${organizationId}/projects`}>
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to={`/organizations/${organizationId}/projects`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">{project.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
              </div>
            </div>
          </div>
          {!editing && (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setEditing(true)}>
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete} loading={deleting}>
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {editing ? (
          <Card>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Edit Project</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Project Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Status
                </label>
                <select
                  className="px-3 py-2 bg-white border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
              <div className="flex gap-3">
                <Button type="submit" loading={saving}>
                  Save Changes
                </Button>
                <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <h2 className="text-lg font-semibold text-text-primary mb-4">Project Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-text-secondary">Description</label>
                    <p className="text-text-primary mt-1">
                      {project.description || 'No description provided'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
            <div>
              <Card>
                <h2 className="text-lg font-semibold text-text-primary mb-4">Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-text-secondary" />
                    <div>
                      <p className="text-xs text-text-secondary">Created</p>
                      <p className="text-sm text-text-primary">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-text-secondary" />
                    <div>
                      <p className="text-xs text-text-secondary">Created By</p>
                      <p className="text-sm text-text-primary">
                        {project.createdBy?.firstName || project.createdBy?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
