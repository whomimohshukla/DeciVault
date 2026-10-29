import { Building2, LayoutDashboard, LogOut, Users } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Organizations",
    url: "/organizations",
    icon: Building2,
  },
  {
    title: "Invitations",
    url: "/invitations",
    icon: Users,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const { user, setUser } = useAuth()

  const handleLogout = async () => {
    try {
      const { logout } = await import("@/services/auth")
      await logout()
    } catch {
      // ignore
    }
    setUser(null)
    window.location.href = "/login"
  }

  return (
    <Sidebar className="border-r border-[#d9ecf0] bg-[linear-gradient(180deg,#0b1d24_0%,#0f2530_100%)] text-white">
      <SidebarHeader className="border-b border-white/10 bg-white/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="rounded-xl hover:bg-white/10 data-[active=true]:bg-white/10">
              <Link to="/dashboard" className="flex items-center gap-3">
                <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0E6669] via-[#2a8d92] to-[#5fc7cc] text-xs font-bold text-white ring-1 ring-white/20">
                  DV
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight text-white">
                  <span className="truncate font-semibold">DeciVault</span>
                  <span className="truncate text-[11px] text-slate-300">Workspace</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-transparent">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] text-slate-300/80">Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    isActive={location.pathname === item.url || (item.url !== "/dashboard" && location.pathname.startsWith(item.url))}
                    className="rounded-xl hover:bg-white/10 data-[active=true]:bg-[#93e9ed]/12 data-[active=true]:text-white"
                  >
                    <Link to={item.url} className="text-white/90">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10 bg-white/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="rounded-xl hover:bg-white/10">
              <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-[#a7f0f2] text-xs font-semibold text-[#0b3941]">
                {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight text-white">
                <span className="truncate font-medium">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.firstName || user?.email}
                </span>
                <span className="truncate text-xs text-slate-300">{user?.email}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="rounded-xl text-white hover:bg-white/10 hover:text-white">
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
