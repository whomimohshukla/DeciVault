import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ChaiNavbar from '../components/layout/ChaiNavbar';
import { Footer } from '../components/footer';
import { Building2, FileText, Brain, Users } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.08)_0%,transparent_60%)] pointer-events-none" />
      <ChaiNavbar />
      <main className="relative flex-1 max-w-6xl mx-auto px-6 sm:px-12 pt-32 pb-16 w-full">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-medium mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back,{' '}
            <span className="highlight">
              {user?.firstName || user?.email}
            </span>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/organizations" className="group card-chai p-6 hover:opacity-100 hover:border-orange-50/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-montserrat text-lg font-semibold mb-2">Organizations</h3>
            <p className="text-muted-foreground text-sm">Manage your teams and organizations</p>
          </Link>
          <div className="group card-chai p-6 opacity-60">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-4">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-montserrat text-lg font-semibold mb-2">Decisions</h3>
            <p className="text-muted-foreground text-sm">Track and review decisions (coming soon)</p>
          </div>
          <div className="group card-chai p-6 opacity-60">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="font-montserrat text-lg font-semibold mb-2">Documents</h3>
            <p className="text-muted-foreground text-sm">Knowledge base (coming soon)</p>
          </div>
        </div>
        <div className="card-chai p-6">
          <h2 className="font-montserrat text-lg font-semibold mb-4">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Email</p>
              <p>{user?.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Email Verified</p>
              <p>{user?.emailVerified ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Account Status</p>
              <p className="capitalize">{user?.status?.toLowerCase()}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Name</p>
              <p>{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || user?.lastName || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
