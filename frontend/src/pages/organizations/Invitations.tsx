import { useState } from 'react';
import { acceptInvitation, declineInvitation } from '../../services/organizations';
import { useSearchParams } from 'react-router-dom';

export default function Invitations() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setMsg('');
    setError('');
    setLoading(true);
    try {
      const res = await acceptInvitation(token);
      setMsg(res.message || 'Invitation accepted');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to accept');
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    setMsg('');
    setError('');
    setLoading(true);
    try {
      const res = await declineInvitation(token);
      setMsg(res.message || 'Invitation declined');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to decline');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Invitation</h1>
        {msg && <div className="bg-green-50 text-green-700 p-3 rounded mb-4">{msg}</div>}
        {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4">{error}</div>}
        <input
          className="w-full px-3 py-2 border rounded mb-4"
          placeholder="Invitation token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <div className="flex space-x-2">
          <button onClick={handleAccept} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">
            Accept
          </button>
          <button onClick={handleDecline} disabled={loading} className="px-4 py-2 bg-gray-600 text-white rounded">
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
