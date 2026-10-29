import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createDocument, listDocuments, downloadDocument } from '@/services/documents';
import { addDecisionEvidence, getDecision, listDecisionEvidence, removeDecisionEvidence } from '@/services/decisions';
import { ArrowLeft, FileText, Plus, Trash2, Upload, Download } from 'lucide-react';

const statusClasses: Record<string, string> = {
  PROPOSED: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  APPROVED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
  REJECTED: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300',
  SUPERSEDED: 'bg-slate-100 text-slate-800 dark:bg-slate-500/15 dark:text-slate-300',
};

export default function DecisionDetail() {
  const { organizationId, decisionId } = useParams<{ organizationId: string; decisionId: string }>();
  const [decision, setDecision] = useState<any>(null);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [selectedDocumentId, setSelectedDocumentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    if (!organizationId || !decisionId) return;

    try {
      const [decisionResponse, evidenceResponse, documentResponse] = await Promise.all([
        getDecision(organizationId, decisionId),
        listDecisionEvidence(organizationId, decisionId),
        listDocuments(organizationId),
      ]);

      const currentDecision = decisionResponse.data?.decision ?? null;
      const currentEvidence = evidenceResponse.data?.evidence ?? [];
      const currentDocuments = documentResponse.data?.documents ?? [];
      const linkedIds = new Set(currentEvidence.map((entry: any) => entry.documentId));

      setDecision(currentDecision);
      setEvidence(currentEvidence);
      setDocuments(currentDocuments.filter((document: any) => !linkedIds.has(document.id)));
      setSelectedDocumentId(currentDocuments.find((document: any) => !linkedIds.has(document.id))?.id || '');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load decision details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [organizationId, decisionId]);

  const filteredDocuments = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return documents;
    return documents.filter((document) => document.filename.toLowerCase().includes(term));
  }, [documents, query]);

  const handleAddEvidence = async () => {
    if (!organizationId || !decisionId || !selectedDocumentId) return;

    setSaving(true);
    setError('');

    try {
      await addDecisionEvidence(organizationId, decisionId, { documentId: selectedDocumentId });
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add evidence');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveEvidence = async (documentId: string) => {
    if (!organizationId || !decisionId) return;
    if (!window.confirm('Remove this document from the decision evidence?')) return;

    setSaving(true);
    setError('');

    try {
      await removeDecisionEvidence(organizationId, decisionId, documentId);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove evidence');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadEvidence = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !organizationId) return;

    setSaving(true);
    setError('');

    try {
      const contentBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          if (typeof result === 'string') {
            const base64 = result.includes(',') ? result.split(',')[1] : result;
            resolve(base64);
            return;
          }
          reject(new Error('Unable to read uploaded file'));
        };
        reader.onerror = () => reject(new Error('Unable to read uploaded file'));
        reader.readAsDataURL(file);
      });

      await createDocument(organizationId, {
        filename: file.name,
        mimeType: file.type || 'application/octet-stream',
        fileSize: file.size,
        contentBase64,
        projectId: decision?.projectId || null,
      });
      event.target.value = '';
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload evidence');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async (document: any) => {
    if (!organizationId) return;

    try {
      const response = await downloadDocument(organizationId, document.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = document.filename;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to download document');
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-5">
          <div className="h-7 w-40 animate-pulse rounded-full bg-muted" />
          <div className="premium-panel h-32 animate-pulse border-0 bg-slate-200/80 dark:bg-slate-800/80" />
          <div className="grid gap-5 lg:grid-cols-[1.5fr_0.9fr]">
            <div className="premium-panel h-64 animate-pulse border-0 bg-slate-200/80 dark:bg-slate-800/80" />
            <div className="premium-panel h-64 animate-pulse border-0 bg-slate-200/80 dark:bg-slate-800/80" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (!decision) {
    return (
      <AppShell>
        <div className="premium-panel p-6">
          <Link to={`/organizations/${organizationId}/decisions`} className="inline-flex items-center text-sm text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to register
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">Decision not found or no access.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="premium-panel overflow-hidden p-5 sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Link to={`/organizations/${organizationId}/decisions`}>
                <Button variant="outline" size="sm" className="rounded-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to register
                </Button>
              </Link>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0E6669]">Decision overview</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{decision.title}</h1>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses[decision.status] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                {decision.status}
              </Badge>
              {decision.project?.name && <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">{decision.project.name}</Badge>}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="premium-panel p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Owner</p>
            <p className="mt-3 text-lg font-semibold text-foreground">{decision.owner ? `${decision.owner.firstName || ''} ${decision.owner.lastName || ''}`.trim() || decision.owner.email : 'Unassigned'}</p>
          </div>
          <div className="premium-panel p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Approver</p>
            <p className="mt-3 text-lg font-semibold text-foreground">{decision.approver ? `${decision.approver.firstName || ''} ${decision.approver.lastName || ''}`.trim() || decision.approver.email : 'Not assigned'}</p>
          </div>
          <div className="premium-panel p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Decision date</p>
            <p className="mt-3 text-lg font-semibold text-foreground">{decision.decisionDate ? new Date(decision.decisionDate).toLocaleDateString() : '—'}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <Card className="premium-panel border-0 bg-white/80 dark:bg-slate-900/80">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Decision details</CardTitle>
              <CardDescription>Context, rationale, and decision summary.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Description</h3>
                <p className="text-sm leading-7 text-foreground">{decision.description}</p>
              </div>

              {decision.problemContext && (
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Problem context</h3>
                  <p className="text-sm leading-7 text-foreground">{decision.problemContext}</p>
                </div>
              )}

              {decision.rationale && (
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Rationale</h3>
                  <p className="text-sm leading-7 text-foreground">{decision.rationale}</p>
                </div>
              )}

              {decision.alternatives && (
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Alternatives considered</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm leading-7 text-foreground">
                    {Array.isArray(decision.alternatives)
                      ? decision.alternatives.map((item: string, index: number) => <li key={`${item}-${index}`}>{item}</li>)
                      : String(decision.alternatives).split(/\n+/).filter(Boolean).map((item: string, index: number) => <li key={`${item}-${index}`}>{item}</li>)}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="premium-panel border-0 bg-white/80 dark:bg-slate-900/80">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-2xl border border-border bg-slate-50/80 p-3 dark:bg-slate-800/60">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Owner</p>
                <p className="mt-2 font-medium text-foreground">{decision.owner ? `${decision.owner.firstName || ''} ${decision.owner.lastName || ''}`.trim() || decision.owner.email : 'Unassigned'}</p>
              </div>
              <div className="rounded-2xl border border-border bg-slate-50/80 p-3 dark:bg-slate-800/60">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Approver</p>
                <p className="mt-2 font-medium text-foreground">{decision.approver ? `${decision.approver.firstName || ''} ${decision.approver.lastName || ''}`.trim() || decision.approver.email : 'Not assigned'}</p>
              </div>
              <div className="rounded-2xl border border-border bg-slate-50/80 p-3 dark:bg-slate-800/60">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Effective date</p>
                <p className="mt-2 font-medium text-foreground">{decision.effectiveDate ? new Date(decision.effectiveDate).toLocaleDateString() : '—'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="premium-panel border-0 bg-white/80 dark:bg-slate-900/80">
          <CardHeader className="flex-row items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl text-foreground">Supporting evidence</CardTitle>
              <CardDescription>Linked documents that support this decision.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent">
                <Upload className="h-4 w-4" />
                Upload
                <input type="file" className="hidden" onChange={handleUploadEvidence} />
              </label>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <Input
                placeholder="Search documents by filename"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-11 rounded-full border-slate-200 bg-slate-50 text-sm dark:bg-slate-800 dark:border-slate-700"
              />
              <select
                value={selectedDocumentId}
                onChange={(event) => setSelectedDocumentId(event.target.value)}
                className="h-11 rounded-full border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select a document</option>
                {filteredDocuments.map((document) => (
                  <option key={document.id} value={document.id}>{document.filename}</option>
                ))}
              </select>
              <Button type="button" onClick={handleAddEvidence} disabled={!selectedDocumentId || saving} className="rounded-full">
                <Plus className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Add evidence'}
              </Button>
            </div>

            {evidence.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-border bg-slate-50/60 p-8 text-center dark:bg-slate-900/40">
                <FileText className="mx-auto mb-3 h-8 w-8 text-[#0E6669]" />
                <p className="text-sm font-medium text-foreground">No supporting documents yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Link an existing document or upload a new one to strengthen the decision record.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {evidence.map((entry) => (
                  <div key={entry.id} className="flex flex-col gap-3 rounded-[22px] border border-border bg-slate-50/60 p-4 md:flex-row md:items-center md:justify-between dark:bg-slate-900/60">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-[#0E6669]/10 p-2 text-[#0E6669]">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{entry.document.filename}</p>
                          {entry.document.project && <Badge variant="secondary" className="rounded-full">{entry.document.project.name}</Badge>}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {entry.document.mimeType} • {entry.document.fileSize ? `${Math.max(1, Math.round(entry.document.fileSize / 1024))} KB` : '0 KB'} • {new Date(entry.createdAt).toLocaleDateString()}
                        </p>
                        {entry.note && <p className="mt-2 text-sm text-muted-foreground">{entry.note}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => handleDownload(entry.document)}>
                        <Download className="mr-2 h-4 w-4" />
                        Open
                      </Button>
                      <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => handleRemoveEvidence(entry.documentId)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
