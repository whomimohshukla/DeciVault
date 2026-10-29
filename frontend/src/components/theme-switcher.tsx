import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-background/80 text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#f5c542]/40 hover:bg-[#f5c542]/10 hover:text-[#d8a521]"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export default ThemeSwitcher;
