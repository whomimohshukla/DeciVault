import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    }
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-sm border-b border-orange-50/15">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-semibold tracking-tight">DeciVault</span>
        </Link>
        <nav className="flex items-center space-x-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-neutral-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link to="/organizations" className="text-neutral-400 hover:text-white transition-colors">
                Organizations
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-black rounded-none rounded-tr-lg rounded-bl-lg hover:bg-neutral-200 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-neutral-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-white text-black rounded-none rounded-tr-lg rounded-bl-lg hover:bg-neutral-200 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
