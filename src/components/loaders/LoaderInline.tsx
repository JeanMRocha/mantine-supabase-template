import { Group, Loader, Text, useMantineTheme } from '@mantine/core';

type Props = { message?: string };

export default function LoaderInline({ message = 'Carregando...' }: Props) {
  const theme = useMantineTheme();

  return (
    <Group gap="xs" align="center" aria-busy="true">
      <Loader size="sm" />
      <Text size="sm" c={theme.colorScheme === 'dark' ? 'gray.4' : 'dimmed'}>
        {message}
      </Text>
    </Group>
  );
}
