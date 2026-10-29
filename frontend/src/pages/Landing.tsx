import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronRight,
  FolderKanban,
  Layers3,
  Lock,
  Play,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Decision intelligence',
    description: 'Track the context, trade-offs, and rationale behind every strategic move.',
    tint: 'bg-[#0E6669]/10 text-[#0E6669]',
  },
  {
    icon: FolderKanban,
    title: 'Project clarity',
    description: 'Align initiatives, owners, and milestones across teams and organizations.',
    tint: 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
  },
  {
    icon: Users,
    title: 'Team coordination',
    description: 'Give the right people the right visibility without creating information chaos.',
    tint: 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300',
  },
  {
    icon: Shield,
    title: 'Audit ready',
    description: 'Keep a clean, reviewable trail of what changed and why it changed.',
    tint: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  },
];

const stats = [
  { label: 'Monthly decisions logged', value: '12.8k' },
  { label: 'Average decision time', value: '2.4x faster' },
  { label: 'Org-wide visibility', value: '99.9%' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(20,125,130,0.12),_transparent_28%),linear-gradient(180deg,#f8fbfc_0%,#eef5f6_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top,_rgba(18,163,170,0.18),_transparent_28%),linear-gradient(180deg,#07131d_0%,#0d1a27_100%)] dark:text-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0E6669] via-[#2a8d92] to-[#5fc7cc] text-sm font-bold text-white shadow-[0_12px_25px_rgba(14,102,105,0.32)]">
              DV
            </div>
            <div className="text-left">
              <div className="text-lg font-semibold tracking-[-0.04em] text-slate-900 dark:text-white">DeciVault</div>
              <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#0E6669] dark:text-[#8fe6ea]">Decision engine</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-3 md:flex">
            {['Product', 'Solutions', 'Resources'].map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="rounded-full px-4 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="rounded-full bg-gradient-to-r from-[#0E6669] to-[#2f9aa0] text-white shadow-[0_18px_35px_rgba(14,102,105,0.28)] hover:brightness-105">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-20">
          <div className="absolute inset-x-0 top-0 h-[540px] bg-[radial-gradient(circle_at_20%_20%,rgba(14,102,105,0.18),transparent_24%),radial-gradient(circle_at_80%_10%,rgba(17,155,160,0.14),transparent_20%)]" />
          <div className="premium-grid absolute inset-0 opacity-60" />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#9ddcdf] bg-[#dff5f5] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#0c5d60] dark:border-[#1f5d63] dark:bg-[#102f34] dark:text-[#b8f0f2]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Smarter organizational memory
                </div>

                <h1 className="max-w-xl text-4xl font-semibold tracking-[-0.06em] text-slate-900 dark:text-white sm:text-5xl lg:text-7xl">
                  Turn decisions into
                  <span className="block bg-gradient-to-r from-[#0E6669] via-[#098f96] to-[#6cd6d9] bg-clip-text text-transparent">
                    lasting clarity.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                  Capture every decision, attach the supporting evidence, and keep teams aligned with a living system built for accountability and momentum.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link to="/register">
                    <Button size="lg" className="h-12 rounded-full bg-gradient-to-r from-[#0E6669] to-[#2f9aa0] text-white shadow-[0_22px_40px_rgba(14,102,105,0.30)] hover:brightness-105">
                      Get started free
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="secondary" size="lg" className="h-12 rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800">
                      <Play className="h-4 w-4" />
                      Watch demo
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                  {['Evidence-backed decisions', 'Live team visibility', 'Clear audit trail'].map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
                      <CheckCircle2 className="h-4 w-4 text-[#0E6669] dark:text-[#8fe6ea]" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xl">
                <div className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-[#67d4d6]/20 blur-3xl" />
                <div className="absolute -right-6 bottom-6 h-28 w-28 rounded-full bg-[#93d2d5]/20 blur-3xl" />

                <div className="premium-panel relative overflow-hidden border-0 p-5 dark:bg-slate-900/80">
                  <div className="rounded-[28px] border border-slate-200 bg-slate-50/90 p-5 dark:border-slate-700 dark:bg-slate-950/80">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0E6669] dark:text-[#8fe6ea]">Executive overview</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-900 dark:text-white">Decision pulse</h2>
                      </div>
                      <div className="rounded-full bg-[#ddf4f2] px-2.5 py-1 text-[10px] font-semibold text-[#0E6669] dark:bg-[#133c42] dark:text-[#b8f0f2]">
                        Live
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/80">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Critical events</p>
                        <div className="mt-3 flex items-end justify-between">
                          <div className="text-3xl font-semibold tracking-[-0.05em] text-slate-900 dark:text-white">318</div>
                          <span className="text-xs font-medium text-emerald-600">+12.4%</span>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/80">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Evidence linked</p>
                        <div className="mt-3 flex items-end justify-between">
                          <div className="text-3xl font-semibold tracking-[-0.05em] text-slate-900 dark:text-white">84%</div>
                          <span className="text-xs font-medium text-[#0E6669]">Healthy</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/80">
                      <div className="mb-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                        <span>Quarterly decisions</span>
                        <span className="font-semibold text-slate-900 dark:text-white">+24%</span>
                      </div>
                      <div className="flex h-28 items-end gap-2">
                        {[42, 58, 48, 72, 65, 85, 94].map((height, index) => (
                          <div key={height + index} className="flex-1 rounded-t-2xl bg-gradient-to-t from-[#0E6669] via-[#2f9aa0] to-[#9ce0e4]" style={{ height: `${height}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0E6669]">Why teams choose DeciVault</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-900 dark:text-white sm:text-4xl">
                  Strategic clarity for every decision.
                </h2>
              </div>
              <Link to="/register" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0E6669]">
                Explore platform <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {features.map(({ icon: Icon, title, description, tint }) => (
                <div key={title} className="rounded-[26px] border border-slate-200 bg-white/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.04)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
                  <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-2xl ${tint}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold tracking-[-0.04em] text-slate-900 dark:text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[32px] border border-slate-200 bg-white/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.04)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0E6669]">Built for accountable teams</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-900 dark:text-white sm:text-4xl">
                  Keep the story behind every choice visible.
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                  From strategy to execution, DeciVault keeps the rationale, owners, evidence, and outcomes connected in one reviewable workspace.
                </p>
                <div className="mt-6 space-y-4">
                  {[
                    { icon: Layers3, title: 'Connected records', text: 'Bring context, projects, and evidence together' },
                    { icon: BarChart3, title: 'Faster reviews', text: 'Surface the right information before decisions are made' },
                    { icon: Lock, title: 'Secure access', text: 'Keep org and project boundaries enforced by default' },
                  ].map(({ icon: Icon, title, text }) => (
                    <div key={title} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/70">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dff5f5] text-[#0E6669] dark:bg-[#0d3135] dark:text-[#b8f0f2]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950/70">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
                    <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 pt-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[32px] bg-gradient-to-r from-[#0E6669] to-[#1b8a93] p-8 text-white shadow-[0_30px_70px_rgba(14,102,105,0.28)] sm:p-10 lg:p-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d8f7f8]">Ready to get started?</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
                  Make every decision easier to trace and trust.
                </h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/register">
                  <Button size="lg" variant="secondary" className="h-12 rounded-full bg-white text-[#0E6669] hover:bg-slate-100">
                    Start free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="h-12 rounded-full border-white/40 bg-transparent text-white hover:bg-white/10">
                    See platform
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-[#f3f7f8] dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr] lg:px-8">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0E6669] via-[#2a8d92] to-[#5fc7cc] text-sm font-bold text-white shadow-[0_12px_25px_rgba(14,102,105,0.32)]">
                DV
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white">DeciVault</div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#0E6669]">Decision engine</div>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
              Giving organizations a clear, accountable way to capture, track, and revisit the decisions that drive progress.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Product</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li><a href="#" className="hover:text-[#0E6669]">Overview</a></li>
              <li><a href="#" className="hover:text-[#0E6669]">Use cases</a></li>
              <li><a href="#" className="hover:text-[#0E6669]">Security</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Company</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li><a href="#" className="hover:text-[#0E6669]">About</a></li>
              <li><a href="#" className="hover:text-[#0E6669]">Customers</a></li>
              <li><a href="#" className="hover:text-[#0E6669]">Careers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Resources</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li><a href="#" className="hover:text-[#0E6669]">Documentation</a></li>
              <li><a href="#" className="hover:text-[#0E6669]">Contact</a></li>
              <li><a href="#" className="hover:text-[#0E6669]">Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 py-4 dark:border-slate-800">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-600 dark:text-slate-300 sm:px-6 lg:flex-row lg:px-8">
            <span>© 2025 DeciVault. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-[#0E6669]">Terms</a>
              <a href="#" className="hover:text-[#0E6669]">Privacy</a>
              <a href="#" className="hover:text-[#0E6669]">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
