import { Box, Group, Stack, Title, ActionIcon } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useStore } from '@nanostores/react';
import { $tema, alternarTema } from '@global/themeStore';
import { $loading } from '@global/loadingStore';
import { LoaderGlobal } from '@components/loaders';

/**
 * 🌿 AppLayout
 * Layout raiz do PerfilSolo — gerencia tema dinâmico e exibe o loader global.
 */
export const AppLayout = () => {
  const tema = useStore($tema);
  const loading = useStore($loading);

  return (
    <Stack p="md" gap="md" style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Cabeçalho */}
      <Group justify="space-between" align="center">
        <Title order={2} c="green.8">
          🌱 PerfilSolo
        </Title>

        {/* Alternância de tema */}
        <ActionIcon
          variant="light"
          color="green"
          size="lg"
          radius="md"
          onClick={alternarTema}
          title="Alternar tema"
        >
          {tema === 'light' ? <IconMoon size={20} /> : <IconSun size={20} />}
        </ActionIcon>
      </Group>

      {/* Loader Global — aparece quando $loading = true */}
      {loading && (
        <Box
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <LoaderGlobal message="Carregando dados..." />
        </Box>
      )}

      {/* Conteúdo principal renderizado via rotas */}
      <Box flex={1}>
        <Outlet />
      </Box>
    </Stack>
  );
};
