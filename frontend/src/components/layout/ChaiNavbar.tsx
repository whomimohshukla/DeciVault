import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../navbar';

function Logo() {
  return (
    <Link to="/" aria-label="DeciVault home" className="flex items-center">
      <span className="font-semibold text-lg tracking-tight font-onest">DeciVault</span>
    </Link>
  );
}

export default function ChaiNavbar() {
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      const { logout } = await import('../../services/auth');
      await logout();
    } catch {
      // ignore
    }
    setUser(null);
    window.location.href = '/login';
  };

  const links = user
    ? [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Organizations', href: '/organizations' },
        { label: 'Invitations', href: '/invitations' },
        { label: 'Logout', href: '#', onClick: handleLogout },
      ]
    : [
        { label: 'Login', href: '/login' },
        { label: 'Get Started', href: '/register' },
      ];

  return <Navbar logo={<Logo />} layout="menu" links={links as any} />;
}
