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
 * - Aguenta erros que não são instâncias de Error (ex.: objetos crus)
 * - Serialização segura (evita "Cannot convert object to primitive value")
 * - Log remoto (services/loggerService) com fallback local (services/loggerLocal)
 * - Mantine UI amigável com opções de recarregar e voltar ao painel
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
    raw?: unknown; // objeto bruto do erro serializado com segurança
  };
}

/** 🔐 Serializa com segurança qualquer valor (evita throws em String/JSON) */
function toSafeString(value: unknown): string {
  try {
    if (value instanceof Error) {
      return `${value.name}: ${value.message}`;
    }
    if (typeof value === 'string') return value;
    // tenta JSON primeiro com replacer que lida com ciclos
    const seen = new WeakSet();
    const json = JSON.stringify(
      value,
      (_, v) => {
        if (typeof v === 'object' && v !== null) {
          if (seen.has(v)) return '[Circular]';
          seen.add(v);
        }
        return v;
      },
      2,
    );
    if (json && json !== '{}') return json;
    return String(value);
  } catch {
    // último recurso
    try {
      return String(value);
    } catch {
      return '[Unserializable value]';
    }
  }
}

/** 🔧 Garante Error a partir de qualquer coisa lançada */
function normalizeToError(errLike: unknown): Error {
  if (errLike instanceof Error) return errLike;
  const msg = toSafeString(errLike);
  const e = new Error(msg);
  // anexa o bruto para inspeção no logger
  (e as any).__raw = errLike;
  return e;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  /** React chama quando um erro acontece durante render/commit de descendentes */
  static getDerivedStateFromError(errorLike: unknown): State {
    const err = normalizeToError(errorLike);
    return {
      hasError: true,
      errorInfo: {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString(),
        origin: typeof window !== 'undefined' ? window.location.pathname : '',
        raw: (err as any).__raw ?? errorLike,
      },
    };
  }

  /** Recebe o erro + stack de componentes (somente DEV) */
  async componentDidCatch(errorLike: unknown, info: React.ErrorInfo) {
    const err = normalizeToError(errorLike);

    const logDetalhado = {
      message: err.message,
      stack: err.stack,
      componente: info?.componentStack,
      caminho: typeof window !== 'undefined' ? window.location.pathname : '',
      data: new Date().toISOString(),
      raw: this.state?.errorInfo?.raw ?? (err as any).__raw,
      userAgent:
        typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    // 🔊 Console estruturado (sem interpolar objeto em string)
    // Evita "Cannot convert object to primitive value"
    // eslint-disable-next-line no-console
    console.groupCollapsed('🚨 [ErrorBoundary]');
    // eslint-disable-next-line no-console
    console.error('🧩 Mensagem:', err.message);
    // eslint-disable-next-line no-console
    console.error('📍 Caminho:', logDetalhado.caminho);
    // eslint-disable-next-line no-console
    console.error('🕒 Data:', logDetalhado.data);
    // eslint-disable-next-line no-console
    console.error('🪴 Stack:', info?.componentStack);
    // eslint-disable-next-line no-console
    console.error('🔹 Raw:', logDetalhado.raw);
    // eslint-disable-next-line no-console
    console.groupEnd();

    // 🔹 Tenta logger remoto; se falhar, logger local
    try {
      const { registrarLog } = await import('@services/loggerService');
      await registrarLog({
        tipo: 'error',
        mensagem: err.message,
        detalhes: logDetalhado,
      });
    } catch (erroFallback) {
      // eslint-disable-next-line no-console
      console.warn(
        '⚠️ Falha ao registrar log remoto, usando fallback local.',
        erroFallback,
      );
      try {
        const { registrarLogLocal } = await import('@services/loggerLocal');
        await registrarLogLocal({
          tipo: 'error',
          mensagem: err.message,
          origem:
            typeof window !== 'undefined' ? window.location.pathname : 'N/A',
          arquivo: 'ErrorBoundary.tsx',
          stack: err.stack,
          detalhes: logDetalhado,
        });
      } catch (erroLocal) {
        // eslint-disable-next-line no-console
        console.error('❌ Falha também no logger local:', erroLocal);
      }
    }
  }

  handleReload = () => window.location.reload();
  handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  };

  handleCopyLog = () => {
    const { errorInfo } = this.state;
    if (!errorInfo) return;
    const payload = {
      ...errorInfo,
      // corta stack pra não ficar enorme
      stack: errorInfo.stack?.split('\n').slice(0, 12).join('\n'),
    };
    const text = toSafeString(payload);
    void navigator.clipboard?.writeText(text);
    alert('📋 Log copiado para a área de transferência!');
  };

  render() {
    if (this.state.hasError && this.state.errorInfo) {
      const { message, stack, timestamp, origin } = this.state.errorInfo;

      return (
        <Stack align="center" justify="center" h="100vh" p="lg">
          <Card shadow="lg" radius="md" withBorder maw={540}>
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
                {stack?.split('\n').slice(0, 6).join('\n')}
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
