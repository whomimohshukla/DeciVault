import { useAuth } from '../context/AuthContext';
import { logout, resendVerification } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [resendMsg, setResendMsg] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/login');
    } catch {
      setUser(null);
      navigate('/login');
    }
  };

  const handleResend = async () => {
    setResendMsg('');
    try {
      await resendVerification();
      setResendMsg('Verification email sent');
    } catch (err: any) {
      setResendMsg(err.response?.data?.message || 'Failed to send');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        {!user?.emailVerified && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-4">
            <p className="text-yellow-800 mb-2">Your email is not verified.</p>
            <button
              onClick={handleResend}
              className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Resend verification email
            </button>
            {resendMsg && <p className="mt-2 text-sm">{resendMsg}</p>}
          </div>
        )}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">User Profile</h2>
          <div className="space-y-2">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Email Verified:</strong> {user?.emailVerified ? 'Yes' : 'No'}</p>
            <p><strong>First Name:</strong> {user?.firstName || '-'}</p>
            <p><strong>Last Name:</strong> {user?.lastName || '-'}</p>
            <p><strong>Status:</strong> {user?.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
