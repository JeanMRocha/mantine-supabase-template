import { Group, Button, Text, Divider, ActionIcon } from '@mantine/core';
import { IconArrowLeft, IconMoon, IconSun } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@nanostores/react';
import { $tema, alternarTema } from '../global-state/themeStore';

interface PageHeaderProps {
  title: string;
  color?: string;
}

export default function PageHeader({
  title,
  color = 'green',
}: PageHeaderProps) {
  const navigate = useNavigate();
  const tema = useStore($tema);

  return (
    <>
      <Group justify="space-between" align="center" mb="md" mt="md">
        <Group>
          <Button
            variant="light"
            color={color}
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate('/dashboard')}
          >
            Voltar
          </Button>
          <Text fz="xl" fw={700} c={`${color}.8`}>
            {title}
          </Text>
        </Group>

        {/* 🌙 Alternância de tema */}
        <ActionIcon
          variant="light"
          color="green"
          size="lg"
          radius="md"
          onClick={alternarTema}
          title="Alternar tema"
        >
          {tema === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />}
        </ActionIcon>
      </Group>
      <Divider my="sm" />
    </>
  );
}
