import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Organizations', href: '/organizations', icon: Building2 },
  { name: 'Invitations', href: '/invitations', icon: Users },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, setUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-white rounded-lg border border-border shadow-sm"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-border">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DV</span>
              </div>
              <span className="text-lg font-semibold text-text-primary">DeciVault</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    active
                      ? 'bg-brand-light text-brand-primary'
                      : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user?.firstName || user?.email}
                </p>
                <p className="text-xs text-text-secondary truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-text-secondary rounded-lg hover:bg-gray-50 hover:text-text-primary transition-colors duration-150"
            >
              <LogOut className="w-5 h-5" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
