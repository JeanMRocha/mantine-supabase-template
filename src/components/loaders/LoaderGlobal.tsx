import {
  Center,
  Stack,
  Loader,
  Text,
  useMantineTheme,
  Card,
} from '@mantine/core';

type Props = { message?: string };

export default function LoaderGlobal({ message = 'Carregando...' }: Props) {
  const theme = useMantineTheme();

  return (
    <Center
      h="100vh"
      w="100vw"
      style={{
        background:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[7]
            : theme.colors.gray[0],
      }}
    >
      <Card withBorder radius="md" p="lg" shadow="sm">
        <Stack align="center" gap="xs">
          <Loader size="lg" />
          <Text fw={600} c="dimmed">
            {message}
          </Text>
        </Stack>
      </Card>
    </Center>
  );
}
