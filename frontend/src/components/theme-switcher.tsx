import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('decivault-theme') as 'dark' | 'light' | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(stored);
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('decivault-theme', next);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(next);
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent/60 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun width={16} height={16} /> : <Moon width={16} height={16} />}
    </button>
  );
}

export default ThemeSwitcher;
