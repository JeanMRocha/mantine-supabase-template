import {
  AppShell,
  Navbar,
  Header,
  Text,
  NavLink,
  Group,
  Button,
  ScrollArea,
} from '@mantine/core';
import {
  IconFlask,
  IconArrowLeft,
  IconHome,
  IconDatabase,
  IconSettings,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { CadastroAnaliseSolo } from '../AnaliseSolo/CadastroAnaliseSolo';
import PageHeader from '../../components/PageHeader';
import { LoaderInline } from '@components/loaders';

/**
 * 🌱 DashboardAnaliseSolo
 * Painel completo integrado ao AppShell padrão do PerfilSolo.
 * Exibe o formulário de cadastro de análise dentro da estrutura global.
 */
export default function DashboardAnaliseSolo() {
  const navigate = useNavigate();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 240,
        breakpoint: 'sm',
      }}
      padding="md"
    >
      {/* 🔹 Cabeçalho superior */}
      <AppShell.Header>
        <Group justify="space-between" px="md" h="100%">
          <Group>
            <Button
              variant="subtle"
              color="green"
              leftSection={<IconArrowLeft size={18} />}
              onClick={() => navigate('/dashboard')}
            >
              Voltar
            </Button>
            <Text fw={700} fz="lg" c="green.8">
              Análises de Solo
            </Text>
          </Group>

          <Button variant="light" color="green">
            Usuário
          </Button>
        </Group>
      </AppShell.Header>

      {/* 🔹 Menu lateral */}
      <AppShell.Navbar p="md">
        <ScrollArea h="100%">
          <NavLink
            label="Início"
            icon={<IconHome size={18} />}
            onClick={() => navigate('/dashboard')}
          />
          <NavLink
            label="Análises de Solo"
            icon={<IconFlask size={18} />}
            active
          />
          <NavLink label="Banco de Dados" icon={<IconDatabase size={18} />} />
          <NavLink label="Configurações" icon={<IconSettings size={18} />} />
        </ScrollArea>
      </AppShell.Navbar>

      {/* 🔹 Conteúdo principal */}
      <AppShell.Main>
        <CadastroAnaliseSolo />
      </AppShell.Main>
    </AppShell>
  );
}
