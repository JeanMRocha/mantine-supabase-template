import { Group, Loader, Text, useMantineTheme } from '@mantine/core';
import { motion } from 'framer-motion';

/**
 * 🌿 LoaderInline
 * Loader compacto para seções internas (cards, gráficos, listas, etc).
 */
export default function LoaderInline({
  message,
  size = 'sm',
}: {
  message?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}) {
  const theme = useMantineTheme();

  return (
    <Group
      spacing="xs"
      position="center"
      style={{
        padding: '0.5rem 0',
        color: theme.colors.green[7],
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
      >
        <Loader size={size} color="green" />
      </motion.div>
      {message && (
        <Text fz="sm" c="dimmed" fw={500}>
          {message}
        </Text>
      )}
    </Group>
  );
}
