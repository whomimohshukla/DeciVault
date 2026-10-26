import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ChaiNavbar from '../components/layout/ChaiNavbar';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_50%)] pointer-events-none" />
      <ChaiNavbar />
      <main className="relative max-w-6xl mx-auto px-6 sm:px-12 py-12">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-medium mb-2">Dashboard</h1>
          <p className="text-neutral-400">
            Welcome back,{' '}
            <span className="highlight">
              {user?.firstName || user?.email}
            </span>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/organizations" className="card-chai p-6 sm:opacity-90 hover:opacity-100 hover:border-orange-50/30 transition-all">
            <h3 className="font-montserrat text-lg font-semibold mb-2">Organizations</h3>
            <p className="text-neutral-400 text-sm">Manage your teams and organizations</p>
          </Link>
          <div className="card-chai p-6 sm:opacity-90">
            <h3 className="font-montserrat text-lg font-semibold mb-2">Decisions</h3>
            <p className="text-neutral-400 text-sm">Track and review decisions (coming soon)</p>
          </div>
          <div className="card-chai p-6 sm:opacity-90">
            <h3 className="font-montserrat text-lg font-semibold mb-2">Documents</h3>
            <p className="text-neutral-400 text-sm">Knowledge base (coming soon)</p>
          </div>
        </div>
        <div className="card-chai p-6">
          <h2 className="font-montserrat text-lg font-semibold mb-4">Profile</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-neutral-400">Email:</span> {user?.email}</p>
            <p><span className="text-neutral-400">Email Verified:</span> {user?.emailVerified ? 'Yes' : 'No'}</p>
            <p><span className="text-neutral-400">Status:</span> {user?.status}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
