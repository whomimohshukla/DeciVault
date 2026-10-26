import { Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const getPageTitle = (pathname: string) => {
  if (pathname === '/dashboard') return 'Dashboard';
  if (pathname.startsWith('/organizations')) {
    if (pathname === '/organizations') return 'Organizations';
    if (pathname.includes('/projects')) return 'Projects';
    return 'Organization Details';
  }
  if (pathname === '/invitations') return 'Invitations';
  return 'DeciVault';
};

export default function Header() {
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <header className="bg-white border-b border-border h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-lg transition-colors duration-150">
          <Search className="w-5 h-5" />
        </button>
        <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-lg transition-colors duration-150 relative">
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
