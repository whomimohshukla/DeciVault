import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ArrowRight, Brain, Users, FolderKanban, Shield } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DV</span>
              </div>
              <span className="text-lg font-semibold text-text-primary">DeciVault</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-text-primary mb-6">
            Decision & Knowledge
            <span className="text-brand-primary"> Management Platform</span>
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Capture, track, and manage organizational decisions with intelligent insights, 
            complete audit trails, and seamless team collaboration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-text-primary mb-4">
              Everything you need to make better decisions
            </h2>
            <p className="text-lg text-text-secondary">
              Built for teams that value transparency and institutional knowledge
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <div className="w-10 h-10 bg-brand-light rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-5 h-5 text-brand-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Decision Tracking</h3>
              <p className="text-text-secondary text-sm">
                Keep complete history of organizational decisions with context and rationale
              </p>
            </Card>
            <Card>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FolderKanban className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Project Management</h3>
              <p className="text-text-secondary text-sm">
                Organize work into projects with clear structure and collaboration
              </p>
            </Card>
            <Card>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Team Collaboration</h3>
              <p className="text-text-secondary text-sm">
                Role-based access control with seamless team coordination
              </p>
            </Card>
            <Card>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Audit Trails</h3>
              <p className="text-text-secondary text-sm">
                Complete accountability with full history of all changes
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-12">
            <h2 className="text-3xl font-semibold text-text-primary mb-4">
              Ready to build your institutional memory?
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              Start making better decisions with complete context and traceability
            </p>
            <Link to="/register">
              <Button size="lg">
                Get Started Today
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}
