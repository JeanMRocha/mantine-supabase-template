import { Card, Group, Text, ThemeIcon, Progress, Tooltip } from '@mantine/core';
import { Check, ArrowUp, ArrowDown } from 'lucide-react';
import type { AnaliseSolo } from '../../data/analisesMock';

/**
 * 🌿 RecomendacaoCard
 * Exibe um diagnóstico rápido de cada nutriente
 * com barras de progresso coloridas e tooltips.
 */
export default function RecomendacaoCard({
  analise,
}: {
  analise: AnaliseSolo;
}) {
  const nutrientes = Object.keys(analise.nutrientes);

  const classificar = (valor: number, min: number, max: number) => {
    if (valor < min)
      return { status: 'baixo', color: 'red', icon: <ArrowDown size={16} /> };
    if (valor > max)
      return { status: 'alto', color: 'violet', icon: <ArrowUp size={16} /> };
    return { status: 'ideal', color: 'green', icon: <Check size={16} /> };
  };

  return (
    <Card shadow="sm" radius="md" withBorder p="md">
      <Text fw={600} mb="sm" size="lg" c="green.7">
        Diagnóstico resumido
      </Text>

      {nutrientes.map((key) => {
        const valor = analise.nutrientes[key];
        const [min, max] = analise.faixaIdeal[key];
        const { status, color, icon } = classificar(valor, min, max);

        const percentual = Math.min(
          100,
          Math.max(0, ((valor - min) / (max - min)) * 100),
        );

        const tooltipMsg =
          status === 'baixo'
            ? `Baixo teor de ${key}. Avaliar adubação corretiva.`
            : status === 'alto'
              ? `Excesso de ${key}. Reduzir dose ou espaçar aplicações.`
              : `Nível ideal de ${key}. Manter manejo atual.`;

        return (
          <Tooltip key={key} label={tooltipMsg} position="right" withArrow>
            <Card.Section inheritPadding py="xs">
              <Group justify="space-between" align="center">
                <Group>
                  <ThemeIcon color={color} size="sm" variant="light">
                    {icon}
                  </ThemeIcon>
                  <Text fw={500}>{key}</Text>
                </Group>
                <Text size="sm" c="dimmed">
                  {valor.toFixed(2)} (ideal {min}–{max})
                </Text>
              </Group>

              <Progress
                value={percentual}
                color={color}
                mt="xs"
                size="sm"
                radius="md"
                styles={{ label: { fontSize: 10 } }}
              />
            </Card.Section>
          </Tooltip>
        );
      })}
    </Card>
  );
}
