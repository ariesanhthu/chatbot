'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevents hydration mismatch issue
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // Avoid rendering on SSR

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 border rounded"
    >
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
}
