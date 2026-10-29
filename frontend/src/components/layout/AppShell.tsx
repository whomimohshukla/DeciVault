import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Sparkles } from "lucide-react";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border/80 bg-background/80 px-4 backdrop-blur-xl lg:px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1 rounded-xl border border-border/80 bg-background/80 text-foreground hover:bg-accent/60" />
            <Separator orientation="vertical" className="mr-1 h-5" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#0E6669] via-[#2a8d92] to-[#5fc7cc] text-xs font-bold text-white shadow-sm shadow-[#0E6669]/25">
                DV
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0E6669]">DeciVault</p>
                <p className="text-xs text-muted-foreground">Workspace</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-[#9ddcdf] bg-[#eaf9f9] px-3 py-1 text-xs font-medium text-[#0B5F62] md:flex dark:border-[#1d5157] dark:bg-[#0d2a2d] dark:text-[#b8f0f2]">
              <Sparkles className="h-3.5 w-3.5" />
              Decision clarity in flight
            </div>
            <ThemeSwitcher />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 bg-[radial-gradient(circle_at_top,_rgba(14,102,105,0.08),_transparent_28%)] p-4 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
