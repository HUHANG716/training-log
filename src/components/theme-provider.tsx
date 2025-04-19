'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return <>{children}</>;
  }
  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      {...props}>
      {children}
    </NextThemesProvider>
  );
}
