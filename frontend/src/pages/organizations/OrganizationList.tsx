import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { listOrganizations, createOrganization } from "@/services/organizations"
import { AppShell } from "@/components/layout/AppShell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Building2, Users } from "lucide-react"

export default function OrganizationList() {
  const [orgs, setOrgs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [creating, setCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const load = async () => {
    try {
      const res = await listOrganizations()
      setOrgs(res.data.organizations || [])
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load organizations")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setCreating(true)
    try {
      await createOrganization({ name, slug })
      setName("")
      setSlug("")
      setShowCreateForm(false)
      load()
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create organization")
    } finally {
      setCreating(false)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Organizations</h1>
            <p className="text-muted-foreground">Manage your organizations and teams</p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="mr-2 h-4 w-4" />
            New organization
          </Button>
        </div>

        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {error}
          </div>
        )}

        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create organization</CardTitle>
              <CardDescription>Add a new organization to your workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Acme Inc."
                      value={name}
                      onChange={handleNameChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      placeholder="acme-inc"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase())}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={creating}>
                    {creating ? "Creating..." : "Create"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : orgs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">No organizations yet</p>
              <p className="text-sm text-muted-foreground mb-4">Create your first organization to get started</p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create organization
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orgs.map((org) => (
              <Card key={org.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {org.name}
                  </CardTitle>
                  <CardDescription>{org.slug}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Role: {org.role}</span>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/organizations/${org.id}`}>View</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
