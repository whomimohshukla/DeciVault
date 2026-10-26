import ChaiNavbar from '../components/layout/ChaiNavbar';
import { Hero } from '../components/hero';
import { Footer } from '../components/footer';
import { Brain, FileText, Users, GitBranch, Shield, Zap } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.08)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.05)_0%,transparent_50%)] pointer-events-none" />
      <ChaiNavbar />
      <main className="relative max-w-6xl mx-auto px-6 sm:px-12 pt-32 pb-16 sm:pt-40 sm:pb-24">
        <Hero
          badge="AI-Powered Platform"
          title={
            <>
              Decision & Knowledge
              <br />
              <span className="highlight">Management System</span>
            </>
          }
          primary={{ label: 'Get Started Free', href: '/register' }}
          secondary={{ label: 'Sign In', href: '/login' }}
        >
          Capture, track, and manage organizational decisions with{' '}
          <span className="highlight">intelligent insights</span>, complete audit trails, and{' '}
          <span className="highlight">seamless collaboration</span>.
        </Hero>
        
        <section id="features" className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-medium mb-4">
              Everything you need to <span className="highlight">make better decisions</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for teams that value transparency, accountability, and institutional memory
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group card-chai p-6 sm:opacity-90 hover:opacity-100 hover:border-orange-50/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="font-montserrat text-lg font-semibold mb-2">Intelligent Decision Tracking</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Keep a complete history of organizational decisions with context, rationale, and supporting evidence in one place.</p>
            </div>
            <div className="group card-chai p-6 sm:opacity-90 hover:opacity-100 hover:border-orange-50/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-montserrat text-lg font-semibold mb-2">Knowledge Management</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Organize documents, extract insights with smart search, and build a searchable knowledge base for your team.</p>
            </div>
            <div className="group card-chai p-6 sm:opacity-90 hover:opacity-100 hover:border-orange-50/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-montserrat text-lg font-semibold mb-2">Team Collaboration</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Work together with role-based access control, streamlined workflows, and real-time collaboration.</p>
            </div>
            <div className="group card-chai p-6 sm:opacity-90 hover:opacity-100 hover:border-orange-50/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GitBranch className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="font-montserrat text-lg font-semibold mb-2">Version Control</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Track decision evolution with full version history and understand how choices changed over time.</p>
            </div>
            <div className="group card-chai p-6 sm:opacity-90 hover:opacity-100 hover:border-orange-50/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="font-montserrat text-lg font-semibold mb-2">Complete Audit Trails</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Every action is logged with full accountability. Meet compliance requirements with confidence.</p>
            </div>
            <div className="group card-chai p-6 sm:opacity-90 hover:opacity-100 hover:border-orange-50/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="font-montserrat text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Built for speed and efficiency. Find what you need instantly with powerful search and filtering.</p>
            </div>
          </div>
        </section>
        
        <section className="mt-32 text-center">
          <div className="card-chai p-12 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-medium mb-4">
              Ready to build your <span className="highlight">institutional memory</span>?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join teams that make better decisions with complete context and traceability
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register" className="btn-asym inline-flex h-11 items-center gap-2 bg-white text-black px-6 text-sm font-medium transition-all hover:bg-neutral-200 hover:scale-105">
                Start Free Today
              </a>
              <a href="/login" className="btn-asym-mirror inline-flex h-11 items-center gap-2 border border-border px-6 text-sm font-medium transition-all hover:bg-accent/60">
                Sign In
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
