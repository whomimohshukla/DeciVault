import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import ChaiNavbar from '../components/layout/ChaiNavbar';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });
      await checkAuth();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
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
            <h1 className="text-2xl sm:text-3xl font-medium mb-2">Create account</h1>
            <p className="text-neutral-400">Get started with <span className="highlight">DeciVault</span></p>
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
                minLength={8}
                className="w-full px-3 py-2 bg-transparent border border-orange-50/15 rounded-lg focus:outline-none focus:border-orange-50/30"
                placeholder="Password (min 8 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="text"
                className="w-full px-3 py-2 bg-transparent border border-orange-50/15 rounded-lg focus:outline-none focus:border-orange-50/30"
                placeholder="First name (optional)"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                className="w-full px-3 py-2 bg-transparent border border-orange-50/15 rounded-lg focus:outline-none focus:border-orange-50/30"
                placeholder="Last name (optional)"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-asym w-full py-2 px-4 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
            <div className="text-center text-sm">
              <Link to="/login" className="text-neutral-400 hover:text-foreground transition-colors">
                Already have an account? <span className="highlight">Sign in</span>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
