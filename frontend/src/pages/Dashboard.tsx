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
import { listDecisions } from "@/services/decisions"
import { Building2, FolderKanban, Users, Plus, ArrowRight, ClipboardList, Sparkles } from "lucide-react"

export default function Dashboard() {
  const { user } = useAuth()
  const [organizations, setOrganizations] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [decisions, setDecisions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const orgRes = await listOrganizations()
        const orgs = orgRes.data?.organizations || []
        setOrganizations(orgs)

        if (orgs.length > 0) {
          try {
            const [projRes, decRes] = await Promise.all([
              listProjects(orgs[0].id),
              listDecisions(orgs[0].id),
            ])
            setProjects(projRes.data?.projects || [])
            setDecisions(decRes.data?.decisions || [])
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

  const firstName = user?.firstName || user?.email?.split("@")[0] || "there"

  const statCards = [
    {
      label: "Organizations",
      value: organizations.length,
      icon: Building2,
      accent: "bg-[#f8e7b7] text-[#7d5810]",
    },
    {
      label: "Projects",
      value: projects.length,
      icon: FolderKanban,
      accent: "bg-[#e7f2ff] text-[#234d7d]",
    },
    {
      label: "Decisions",
      value: decisions.length,
      icon: ClipboardList,
      accent: "bg-[#eaf9f0] text-[#21694d]",
    },
    {
      label: "Team members",
      value: "—",
      icon: Users,
      accent: "bg-[#f2e9ff] text-[#5a3b8c]",
    },
  ]

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-[30px] border border-[#ead7a5] bg-[radial-gradient(circle_at_top_left,_rgba(212,169,78,0.18),_transparent_36%),rgba(255,255,255,0.9)] p-5 shadow-[0_18px_45px_rgba(59,43,19,0.08)] md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f3d98d] via-[#d7a83b] to-[#b9851d] text-[#18130f] shadow-[0_12px_25px_rgba(183,133,30,0.2)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a6a13]">Overview</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-900">Welcome back, {firstName}</h1>
              <p className="text-sm text-slate-700">Your workspace is ready for the next confident decision.</p>
            </div>
          </div>
          <Button asChild className="h-11 rounded-full bg-gradient-to-r from-[#f0d27a] via-[#d7a83b] to-[#b9851d] text-[#171310] shadow-[0_12px_24px_rgba(183,133,30,0.22)] hover:brightness-105">
            <Link to="/organizations">
              <Plus className="mr-2 h-4 w-4" />
              New project
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map(({ label, value, icon: Icon, accent }) => (
            <Card key={label} className="border border-[#efe4cf] bg-[#fffdfb] shadow-[0_10px_25px_rgba(25,20,15,0.04)]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">{label}</CardTitle>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold tracking-[-0.04em] text-slate-900">{value}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-7">
          <Card className="col-span-4 border border-[#efe4cf] bg-[#fffdfb] shadow-[0_10px_25px_rgba(25,20,15,0.04)]">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg text-slate-900">Recent projects</CardTitle>
                  <CardDescription className="text-slate-600">Your most recent projects across organizations</CardDescription>
                </div>
                <Badge variant="secondary" className="rounded-full bg-[#f8e7b7] text-[#7d5810]">{projects.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-xl" />
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
                    <div key={project.id} className="flex items-center rounded-2xl border border-[#f0e5d1] bg-[#fffaf3] p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8e7b7] text-[#7d5810]">
                        <FolderKanban className="h-4 w-4" />
                      </div>
                      <div className="ml-4 min-w-0 flex-1 space-y-1">
                        <p className="truncate text-sm font-semibold text-slate-900">{project.name}</p>
                        <p className="truncate text-sm text-slate-600">{project.description || "No description"}</p>
                      </div>
                      <div className="ml-auto">
                        <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-700">{project.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FolderKanban className="mb-2 h-8 w-8 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-700">No projects yet</p>
                  <p className="mb-4 text-sm text-slate-600">Get started by creating your first project</p>
                  <Button asChild size="sm" className="rounded-full bg-gradient-to-r from-[#f0d27a] via-[#d7a83b] to-[#b9851d] text-[#171310] hover:brightness-105">
                    <Link to="/organizations">
                      <Plus className="mr-2 h-4 w-4" />
                      Create project
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-3 border border-[#efe4cf] bg-[#fffdfb] shadow-[0_10px_25px_rgba(25,20,15,0.04)]">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg text-slate-900">Recent decisions</CardTitle>
                  <CardDescription className="text-slate-600">Latest decisions from your workspace</CardDescription>
                </div>
                <Badge variant="secondary" className="rounded-full bg-[#eaf9f0] text-[#21694d]">{decisions.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              ) : decisions.length > 0 ? (
                <div className="space-y-4">
                  {decisions.slice(0, 5).map((decision) => (
                    <div key={decision.id} className="rounded-2xl border border-[#f0e5d1] bg-[#fffaf3] p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold leading-none text-slate-900">{decision.title}</p>
                        <Badge variant="secondary" className="rounded-full bg-[#eaf9f0] text-[#21694d] text-[10px]">
                          {decision.status}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs text-slate-600">
                        {decision.project?.name || "No project"} • {decision.decisionDate ? new Date(decision.decisionDate).toLocaleDateString() : "No date"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ClipboardList className="mb-2 h-8 w-8 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-700">No decisions yet</p>
                  <p className="mb-4 text-sm text-slate-600">Capture the first decision in the register</p>
                  <Button asChild size="sm" className="rounded-full bg-gradient-to-r from-[#f0d27a] via-[#d7a83b] to-[#b9851d] text-[#171310] hover:brightness-105">
                    <Link to={organizations[0] ? `/organizations/${organizations[0].id}/decisions` : "/organizations"}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add decision
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border border-[#efe4cf] bg-[#fffdfb] shadow-[0_10px_25px_rgba(25,20,15,0.04)]">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Quick actions</CardTitle>
            <CardDescription className="text-slate-600">Common tasks and navigation</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 md:grid-cols-3">
            <Button variant="ghost" className="justify-start rounded-2xl border border-[#f0e5d1] bg-[#fffaf3] text-slate-700 hover:bg-[#fff2d9]" asChild>
              <Link to="/organizations">
                <Building2 className="mr-2 h-4 w-4 text-[#9a6a13]" />
                Manage organizations
                <ArrowRight className="ml-auto h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start rounded-2xl border border-[#f0e5d1] bg-[#fffaf3] text-slate-700 hover:bg-[#fff2d9]" asChild>
              <Link to="/invitations">
                <Users className="mr-2 h-4 w-4 text-[#9a6a13]" />
                View invitations
                <ArrowRight className="ml-auto h-4 w-4" />
              </Link>
            </Button>
            {organizations[0] && (
              <Button variant="ghost" className="justify-start rounded-2xl border border-[#f0e5d1] bg-[#fffaf3] text-slate-700 hover:bg-[#fff2d9]" asChild>
                <Link to={`/organizations/${organizations[0].id}/decisions`}>
                  <ClipboardList className="mr-2 h-4 w-4 text-[#9a6a13]" />
                  Open decision register
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
