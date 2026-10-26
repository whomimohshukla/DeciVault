import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { listProjects, createProject } from '../../services/projects';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Badge } from '@/components/ui/badge';
import EmptyState from '../../components/shared/EmptyState';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import { FolderKanban, Plus, ArrowLeft } from 'lucide-react';

export default function ProjectList() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

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
      setShowCreateForm(false);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const getStatusVariant = (status: string) => {
    if (status === 'ACTIVE') return 'success';
    if (status === 'ON_HOLD') return 'warning';
    if (status === 'ARCHIVED') return 'gray';
    return 'gray';
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to={`/organizations/${organizationId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
                Back to Organization
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">Projects</h1>
              <p className="text-text-secondary mt-1">
                Manage projects in this organization
              </p>
            </div>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <Card>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Create New Project</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Project Name"
                placeholder="Enter project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="Enter project description (optional)"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" loading={creating}>
                  Create Project
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Projects List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <LoadingSkeleton className="h-6 w-32 mb-2" />
                <LoadingSkeleton className="h-4 w-full mb-2" />
                <LoadingSkeleton className="h-4 w-24" />
              </Card>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <EmptyState
              icon={FolderKanban}
              title="No projects yet"
              description="Create your first project to get started."
              action={
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4" />
                  Create Project
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project.id} to={`/organizations/${organizationId}/projects/${project.id}`}>
                <Card hover className="h-full cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FolderKanban className="w-5 h-5 text-blue-600" />
                    </div>
                    <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{project.name}</h3>
                  <p className="text-sm text-text-secondary line-clamp-2">
                    {project.description || 'No description provided'}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
