'use client';

import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import SessionChecker from '@/services/useTokenRefresh';
import React from 'react';
import theme from '@/theme';
import Snackbar from '@mui/joy/Snackbar';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const { setMode } = useColorScheme();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateMode = (e: MediaQueryListEvent | MediaQueryList) => {
      const isDark = e.matches;
      setMode(isDark ? 'dark' : 'light');

      const shown = sessionStorage.getItem('dark-snackbar-shown');
      if (isDark && !shown) {
        setOpen(true);
        sessionStorage.setItem('dark-snackbar-shown', 'true');
      }
    };

    updateMode(mediaQuery);

    mediaQuery.addEventListener?.('change', updateMode);
    return () => mediaQuery.removeEventListener?.('change', updateMode);
  }, [setMode]);

  return (
    <>
      <Snackbar open={open} onClose={() => setOpen(false)} color="neutral" variant="solid">
        🌙 Dark Mode aktiviert, ich bin schöner im Light Mode!
      </Snackbar>
      {children}
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <meta name="hibp-verify" content="dweb_w4o0uzmt85vz0417g91yg073" />
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <CssVarsProvider defaultMode="system" modeStorageKey="mui-mode" attribute="data-color-scheme" theme={theme}>
          <ThemeInitializer>
            <SessionChecker />
            {children}
          </ThemeInitializer>
        </CssVarsProvider>
      </body>
    </html>
  );
}
