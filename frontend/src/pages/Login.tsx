import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import ChaiNavbar from '../components/layout/ChaiNavbar';
import { Footer } from '../components/footer';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      await checkAuth();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.08)_0%,transparent_60%)] pointer-events-none" />
      <ChaiNavbar />
      <main className="relative flex-1 max-w-6xl mx-auto px-6 sm:px-12 pt-32 pb-16 flex items-center justify-center w-full">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-medium mb-2">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to your <span className="highlight">DeciVault</span> account</p>
          </div>
          <form onSubmit={handleSubmit} className="card-chai p-6 sm:p-8 space-y-4 shadow-lg shadow-black/5">
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">{error}</div>}
            <div className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-transparent border border-border rounded-lg focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-transparent border border-border rounded-lg focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-asym w-full py-2.5 px-4 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 transition-all font-medium"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <div className="text-center space-y-2 text-sm">
              <div>
                <Link to="/forgot-password" className="text-muted-foreground hover:text-foreground transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div>
                <Link to="/register" className="text-muted-foreground hover:text-foreground transition-colors">
                  Don't have an account? <span className="highlight">Create one</span>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
