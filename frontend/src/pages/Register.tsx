import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { notifyError, notifySuccess } from '@/lib/toast';

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
      notifySuccess('Account created!', 'Your DeciVault workspace is ready.');
      navigate('/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      notifyError('Registration failed', message);
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
              <p className="text-sm text-slate-500">Shared clarity</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#9cdfe1] bg-[#eaf9fa] px-3 py-1 text-xs font-medium text-[#0b5f62]">
              <Sparkles className="h-3.5 w-3.5" />
              Built for smarter decisions
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
                Create a sharper decision-making system for your team.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                Organize initiatives, capture evidence, and preserve context so every decision remains accountable and easy to revisit.
              </p>
            </div>
            <div className="space-y-4">
              {[
                'Capture decisions with context and rationale',
                'Track projects and organizations in one place',
                'Keep evidence and approvals close to the record',
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
                    <CardTitle className="text-xl text-slate-900">Create account</CardTitle>
                    <CardDescription className="text-sm text-slate-500">Start with your workspace</CardDescription>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">First name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-[#0E6669] focus:ring-[#0E6669]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">Last name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-[#0E6669] focus:ring-[#0E6669]/20"
                    />
                  </div>
                </div>
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
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-[#0E6669] focus:ring-[#0E6669]/20"
                  />
                  <p className="text-xs text-slate-500">Must be at least 8 characters</p>
                </div>
                <Button type="submit" className="h-11 w-full rounded-xl bg-[#0E6669] text-white shadow-lg shadow-[#0E6669]/20 hover:bg-[#0D5759]" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create account'}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>
                <div className="text-center text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-[#0E6669] hover:underline">
                    Sign in
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
