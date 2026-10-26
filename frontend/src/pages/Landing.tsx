import ChaiNavbar from '../components/layout/ChaiNavbar';
import { Hero } from '../components/hero';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_50%)] pointer-events-none" />
      <ChaiNavbar />
      <main className="relative max-w-6xl mx-auto px-6 sm:px-12 py-16 sm:py-24">
        <Hero
          badge="AI-Powered Platform"
          title={
            <>
              Decision & Knowledge
              <br />
              <span className="highlight">Management System</span>
            </>
          }
          primary={{ label: 'Get Started', href: '/register' }}
          secondary={{ label: 'Sign In', href: '/login' }}
        >
          Capture, track, and manage organizational decisions with{' '}
          <span className="highlight">intelligent insights</span> and complete audit trails.
        </Hero>
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-chai p-6 sm:opacity-90 hover:opacity-100 hover:border-orange-50/30 transition-all">
            <h3 className="font-montserrat text-lg font-semibold mb-2">Decision Tracking</h3>
            <p className="text-neutral-400 text-sm">Keep a complete history of organizational decisions with context and rationale.</p>
          </div>
          <div className="card-chai p-6 sm:opacity-90 hover:opacity-100 hover:border-orange-50/30 transition-all">
            <h3 className="font-montserrat text-lg font-semibold mb-2">Knowledge Management</h3>
            <p className="text-neutral-400 text-sm">Organize documents and extract insights with{' '}
              <span className="highlight">smart search</span>
            </p>
          </div>
          <div className="card-chai p-6 sm:opacity-90 hover:opacity-100 hover:border-orange-50/30 transition-all">
            <h3 className="font-montserrat text-lg font-semibold mb-2">Team Collaboration</h3>
            <p className="text-neutral-400 text-sm">Work together with role-based access and streamlined workflows.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
