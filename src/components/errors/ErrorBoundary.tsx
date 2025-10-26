import React, { Component, ReactNode } from 'react';
import {
  Button,
  Card,
  Stack,
  Text,
  Title,
  Group,
  Code,
  Divider,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconRotateClockwise,
  IconHome,
} from '@tabler/icons-react';

/**
 * 🌿 ErrorBoundary - PerfilSolo
 * Captura erros globais e registra logs locais (fallback) ou remotos (Supabase)
 * Garante que nenhum erro quebre a UI.
 */

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorInfo?: {
    message: string;
    stack?: string;
    timestamp: string;
    origin: string;
  };
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorInfo: {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        origin: window.location.pathname,
      },
    };
  }

  async componentDidCatch(error: Error, info: React.ErrorInfo) {
    const logDetalhado = {
      stack: error.stack,
      componente: info.componentStack,
      caminho: window.location.pathname,
      data: new Date().toISOString(),
    };

    console.groupCollapsed('🚨 [Global ErrorBoundary]');
    console.error('🧩 Mensagem:', error.message);
    console.error('📍 Caminho:', window.location.pathname);
    console.error('🕒 Data:', new Date().toISOString());
    console.error('🪴 Info:', info.componentStack);
    console.groupEnd();

    // 🔹 Fallback com logger remoto → local
    try {
      const { registrarLog } = await import('@services/loggerService');
      await registrarLog({
        tipo: 'error',
        mensagem: error.message,
        detalhes: logDetalhado,
      });
    } catch (erroFallback) {
      console.warn('⚠️ Falha ao registrar log remoto, usando fallback local.');

      try {
        const { registrarLogLocal } = await import('@services/loggerLocal');
        await registrarLogLocal({
          tipo: 'error',
          mensagem: error.message,
          origem: window.location.pathname,
          arquivo: 'ErrorBoundary.tsx',
          stack: error.stack,
          detalhes: logDetalhado,
        });
      } catch (erroLocal) {
        console.error('❌ Falha também no logger local:', erroLocal);
      }
    }
  }

  handleReload = () => window.location.reload();
  handleGoHome = () => (window.location.href = '/dashboard');

  handleCopyLog = () => {
    const { errorInfo } = this.state;
    if (errorInfo) {
      const text = JSON.stringify(errorInfo, null, 2);
      navigator.clipboard.writeText(text);
      alert('📋 Log copiado para a área de transferência!');
    }
  };

  render() {
    if (this.state.hasError && this.state.errorInfo) {
      const { message, stack, timestamp, origin } = this.state.errorInfo;

      return (
        <Stack align="center" justify="center" h="100vh" p="lg">
          <Card shadow="lg" radius="md" withBorder maw={520}>
            <Group align="center" justify="center" mb="md">
              <IconAlertTriangle size={48} color="#f59e0b" />
            </Group>

            <Title order={3} ta="center" c="orange.8">
              Oops! Algo deu errado 🌱
            </Title>

            <Text ta="center" c="dimmed" mt="xs">
              Houve um erro inesperado na aplicação. Você pode tentar recarregar
              ou voltar ao painel principal.
            </Text>

            <Group justify="center" mt="lg">
              <Button
                leftSection={<IconRotateClockwise size={16} />}
                onClick={this.handleReload}
                color="green"
              >
                Recarregar
              </Button>
              <Button
                leftSection={<IconHome size={16} />}
                onClick={this.handleGoHome}
                variant="light"
                color="gray"
              >
                Voltar ao painel
              </Button>
              <Button
                onClick={this.handleCopyLog}
                variant="subtle"
                color="orange"
              >
                Copiar log
              </Button>
            </Group>

            <Divider my="md" />

            <Stack gap="xs">
              <Text size="sm" fw={500}>
                <strong>Mensagem:</strong> {message}
              </Text>
              <Text size="sm" c="dimmed">
                <strong>Rota:</strong> {origin}
              </Text>
              <Text size="sm" c="dimmed">
                <strong>Horário:</strong> {new Date(timestamp).toLocaleString()}
              </Text>
              <Code block fz="xs" mt="sm" c="red.7">
                {stack?.split('\n').slice(0, 4).join('\n')}
              </Code>
            </Stack>
          </Card>
        </Stack>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
