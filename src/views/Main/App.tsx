import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useStore } from '@nanostores/react';
import { $tema, alternarTema } from '@global/themeStore';
import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from '@components/errors/ErrorBoundary';

/**
 * 🌿 App
 * Ponto de entrada principal do PerfilSolo.
 * Inclui o ErrorBoundary global e o tema dinâmico (light/dark).
 */
export default function App() {
  const tema = useStore($tema);

  return (
    <ErrorBoundary>
      <ColorSchemeProvider colorScheme={tema} toggleColorScheme={alternarTema}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: tema,
            primaryColor: 'green',
            fontFamily: 'Inter, sans-serif',
            headings: { fontWeight: 700 },
            colors: {
              green: [
                '#f0fdf4',
                '#dcfce7',
                '#bbf7d0',
                '#86efac',
                '#4ade80',
                '#22c55e',
                '#16a34a',
                '#15803d',
                '#166534',
                '#14532d',
              ],
            },
          }}
        >
          <Notifications position="top-right" />
          <Outlet />
        </MantineProvider>
      </ColorSchemeProvider>
    </ErrorBoundary>
  );
}
