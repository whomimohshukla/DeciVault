import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { AppShell } from "@/components/layout/AppShell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { listOrganizations } from "@/services/organizations"
import { listProjects } from "@/services/projects"
import { Building2, FolderKanban, Users, Plus, ArrowRight } from "lucide-react"

export default function Dashboard() {
  const { user } = useAuth()
  const [organizations, setOrganizations] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const orgRes = await listOrganizations()
        const orgs = orgRes.data?.organizations || []
        setOrganizations(orgs)
        
        if (orgs.length > 0) {
          try {
            const projRes = await listProjects(orgs[0].id)
            setProjects(projRes.data?.projects || [])
          } catch {
            // ignore
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const firstName = user?.firstName || user?.email?.split('@')[0] || 'there'

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Workspace overview</h1>
            <p className="text-muted-foreground">
              Welcome back, {firstName}
            </p>
          </div>
          <Button asChild>
            <Link to="/organizations">
              <Plus className="mr-2 h-4 w-4" />
              New project
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organizations</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{organizations.length}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{projects.length}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">—</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent projects</CardTitle>
              <CardDescription>
                Your most recent projects across organizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="flex items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                        <FolderKanban className="h-4 w-4" />
                      </div>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{project.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {project.description || "No description"}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <Badge variant="secondary">{project.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FolderKanban className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">No projects yet</p>
                  <p className="text-sm text-muted-foreground mb-4">Get started by creating your first project</p>
                  <Button asChild size="sm">
                    <Link to="/organizations">
                      <Plus className="mr-2 h-4 w-4" />
                      Create project
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Common tasks and navigation</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/organizations">
                  <Building2 className="mr-2 h-4 w-4" />
                  Manage organizations
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/invitations">
                  <Users className="mr-2 h-4 w-4" />
                  View invitations
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
