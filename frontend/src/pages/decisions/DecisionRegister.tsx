import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createDecision, listDecisions } from '@/services/decisions';
import { listProjects } from '@/services/projects';
import { ArrowLeft, Plus } from 'lucide-react';

const emptyForm = {
  title: '',
  description: '',
  problemContext: '',
  rationale: '',
  alternatives: '',
  projectId: '',
  decisionDate: '',
  effectiveDate: '',
};

export default function DecisionRegister() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const [decisions, setDecisions] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);

  const loadData = async () => {
    if (!organizationId) return;

    try {
      const [decisionResponse, projectResponse] = await Promise.all([
        listDecisions(organizationId),
        listProjects(organizationId),
      ]);

      setDecisions(decisionResponse.data?.decisions || []);
      setProjects(projectResponse.data?.projects || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load decision register');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [organizationId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!organizationId) return;

    setSaving(true);
    setError('');

    try {
      await createDecision(organizationId, {
        ...form,
        projectId: form.projectId || null,
        decisionDate: form.decisionDate || null,
        effectiveDate: form.effectiveDate || null,
      });

      setForm(emptyForm);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create decision');
    } finally {
      setSaving(false);
    }
  };

  const statusClasses: Record<string, string> = {
    PROPOSED: 'bg-amber-100 text-amber-800',
    APPROVED: 'bg-emerald-100 text-emerald-800',
    REJECTED: 'bg-rose-100 text-rose-800',
    SUPERSEDED: 'bg-slate-100 text-slate-800',
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Link to={`/organizations/${organizationId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to organization
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Decision Register</h1>
              <p className="text-sm text-muted-foreground">Track decisions, rationale, and project context.</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New decision</CardTitle>
            <CardDescription>Capture the decision, context, and relevant project association.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">Decision title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Example: Adopt the new onboarding workflow"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">Detailed description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
                  className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Describe the decision and the expected outcome"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">Problem or context</label>
                <textarea
                  value={form.problemContext}
                  onChange={(e) => setForm((current) => ({ ...current, problemContext: e.target.value }))}
                  className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Describe the context, constraints, or challenge"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">Reasoning and rationale</label>
                <textarea
                  value={form.rationale}
                  onChange={(e) => setForm((current) => ({ ...current, rationale: e.target.value }))}
                  className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Explain why the decision was chosen"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">Alternatives considered</label>
                <textarea
                  value={form.alternatives}
                  onChange={(e) => setForm((current) => ({ ...current, alternatives: e.target.value }))}
                  className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="List option A, option B, and the rejected solutions"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Project</label>
                <select
                  value={form.projectId}
                  onChange={(e) => setForm((current) => ({ ...current, projectId: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">No project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Decision date</label>
                <input
                  type="date"
                  value={form.decisionDate}
                  onChange={(e) => setForm((current) => ({ ...current, decisionDate: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Effective date</label>
                <input
                  type="date"
                  value={form.effectiveDate}
                  onChange={(e) => setForm((current) => ({ ...current, effectiveDate: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" disabled={saving}>
                  <Plus className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Create decision'}
                </Button>
              </div>
            </form>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Decisions for this organization.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : decisions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Decision</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Decision date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {decisions.map((decision) => (
                      <TableRow key={decision.id}>
                        <TableCell>
                          <Link to={`/organizations/${organizationId}/decisions/${decision.id}`} className="font-medium text-primary hover:underline">
                            {decision.title}
                          </Link>
                          <div className="text-xs text-muted-foreground">{decision.description.slice(0, 80)}{decision.description.length > 80 ? '…' : ''}</div>
                        </TableCell>
                        <TableCell>{decision.project?.name || '—'}</TableCell>
                        <TableCell>
                          <Badge className={statusClasses[decision.status] || 'bg-slate-100 text-slate-700'}>
                            {decision.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {decision.owner
                            ? `${decision.owner.firstName || ''} ${decision.owner.lastName || ''}`.trim() || decision.owner.email
                            : 'Unassigned'}
                        </TableCell>
                        <TableCell>
                          {decision.decisionDate ? new Date(decision.decisionDate).toLocaleDateString() : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm font-medium">No decisions yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Create the first decision for this organization.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
