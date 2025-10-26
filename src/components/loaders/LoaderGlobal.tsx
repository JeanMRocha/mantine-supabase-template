import {
  Center,
  Loader,
  Text,
  Stack,
  Transition,
  useMantineTheme,
} from '@mantine/core';
import { motion } from 'framer-motion';

/**
 * 🌱 LoaderGlobal
 * Loader elegante de tela cheia para uso em fallback de rotas e carregamentos principais.
 */
export default function LoaderGlobal({ message }: { message?: string }) {
  const theme = useMantineTheme();

  return (
    <Center
      style={{
        height: '100vh',
        backgroundColor: theme.colorScheme === 'dark' ? '#0d1b0f' : '#f8fff9',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Transition
        mounted
        transition="fade"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Stack align="center" spacing="xs" style={styles}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            >
              <Loader size="lg" color="green" />
            </motion.div>
            {message && (
              <Text
                c={theme.colorScheme === 'dark' ? 'green.3' : 'green.7'}
                fw={500}
                fz="md"
              >
                {message}
              </Text>
            )}
          </Stack>
        )}
      </Transition>
    </Center>
  );
}
