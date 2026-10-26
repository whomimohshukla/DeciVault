import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import ChaiNavbar from '../components/layout/ChaiNavbar';

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_50%)] pointer-events-none" />
      <ChaiNavbar />
      <main className="relative max-w-6xl mx-auto px-6 sm:px-12 py-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-medium mb-2">Sign in</h1>
            <p className="text-neutral-400">Welcome back to <span className="highlight">DeciVault</span></p>
          </div>
          <form onSubmit={handleSubmit} className="card-chai p-6 space-y-4">
            {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm">{error}</div>}
            <div className="space-y-3">
              <input
                type="email"
                required
                className="w-full px-3 py-2 bg-transparent border border-orange-50/15 rounded-lg focus:outline-none focus:border-orange-50/30"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                required
                className="w-full px-3 py-2 bg-transparent border border-orange-50/15 rounded-lg focus:outline-none focus:border-orange-50/30"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-asym w-full py-2 px-4 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <div className="text-center space-y-2 text-sm">
              <div>
                <Link to="/forgot-password" className="text-neutral-400 hover:text-foreground transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div>
                <Link to="/register" className="text-neutral-400 hover:text-foreground transition-colors">
                  Don't have an account? <span className="highlight">Register</span>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
