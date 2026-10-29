import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { notifyError, notifySuccess } from '@/lib/toast';

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
      notifySuccess('Welcome back!', 'You have successfully signed in to DeciVault.');
      navigate('/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      notifyError('Sign in failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(14,102,105,0.14),_transparent_32%),linear-gradient(180deg,#f7fafb_0%,#eaf4f5_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(255,255,255,0.28))]" />
      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="hidden rounded-[30px] border border-[#cfe8eb] bg-white/70 p-8 shadow-[0_24px_70px_rgba(14,102,105,0.08)] backdrop-blur-sm lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0E6669] via-[#2a8d92] to-[#5fc7cc] text-sm font-bold text-white shadow-lg shadow-[#0E6669]/25">
              DV
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#0E6669]">DeciVault</p>
              <p className="text-sm text-slate-500">Decision intelligence</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#9cdfe1] bg-[#eaf9fa] px-3 py-1 text-xs font-medium text-[#0b5f62]">
              <Sparkles className="h-3.5 w-3.5" />
              Trusted by modern teams
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
                Turn scattered decisions into a clear institutional memory.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                Capture context, document rationale, and keep every decision traceable with the right people and evidence.
              </p>
            </div>
            <div className="space-y-4">
              {[
                'Decision tracking with complete history',
                'Project and organization-level visibility',
                'Evidence-backed records and approvals',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-[#0E6669]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <Card className="overflow-hidden border-0 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm ring-1 ring-slate-200/80">
            <CardHeader className="space-y-3 border-b border-slate-200/80 bg-slate-50/80 px-6 pb-5 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0E6669] via-[#2a8d92] to-[#5fc7cc] text-sm font-bold text-white">
                    DV
                  </div>
                  <div>
                    <CardTitle className="text-xl text-slate-900">Welcome back</CardTitle>
                    <CardDescription className="text-sm text-slate-500">Sign in to continue</CardDescription>
                  </div>
                </div>
                <ShieldCheck className="h-5 w-5 text-[#0E6669]" />
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-[#0E6669] focus:ring-[#0E6669]/20"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                    <Link to="/forgot-password" className="text-xs font-medium text-[#0E6669] hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-[#0E6669] focus:ring-[#0E6669]/20"
                  />
                </div>

                <Button type="submit" className="h-11 w-full rounded-xl bg-gradient-to-r from-[#0E6669] to-[#2f9aa0] text-white shadow-lg shadow-[#0E6669]/20 hover:brightness-105" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in'}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>

                <div className="text-center text-sm text-slate-600">
                  Need an account?{' '}
                  <Link to="/register" className="font-semibold text-[#0E6669] hover:underline">
                    Create one
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
