// src/views/AnaliseSolo/GraficoAnalise.tsx
import { Box, Group, Stack, Text, Tooltip } from '@mantine/core';
import { normalizar200, corDoStatus, FaixaIdeal } from './soilConfig';

type Props = {
  valores: Record<string, number>;
  faixas: FaixaIdeal;
  onSelectNutriente?: (id: string) => void;
};

function NutrientBar({
  id,
  valor,
  faixa,
  onClick,
}: {
  id: string;
  valor: number;
  faixa: [number, number];
  onClick?: () => void;
}) {
  const pct = normalizar200(valor, faixa); // 0–200%
  const [min, max] = faixa;
  const minPct = normalizar200(min, faixa);
  const maxPct = normalizar200(max, faixa);
  const color = corDoStatus(valor, faixa);

  return (
    <Stack gap={4}>
      <Group justify="space-between">
        <Text fw={600}>{id}</Text>
        <Text size="sm" c="dimmed">
          {valor.toFixed(2)} (ideal {min}–{max})
        </Text>
      </Group>

      <Box
        onClick={onClick}
        style={{
          position: 'relative',
          height: 14,
          borderRadius: 8,
          background:
            'linear-gradient(90deg, rgba(120,120,120,.12) 0%, rgba(120,120,120,.12) 100%)',
          overflow: 'hidden',
        }}
      >
        {/* sombra: faixa ideal em verde-claro */}
        <Box
          style={{
            position: 'absolute',
            insetBlock: 0,
            left: `${Math.min(minPct, maxPct)}%`,
            width: `${Math.abs(maxPct - minPct)}%`,
            background: 'rgba(34,197,94,.25)',
          }}
        />

        {/* barra do valor atual */}
        <Tooltip label={`${pct.toFixed(0)}% do alvo`}>
          <Box
            style={{
              position: 'absolute',
              insetBlock: 0,
              left: 0,
              width: `${pct}%`,
              background:
                color === 'red'
                  ? 'rgba(239,68,68,0.9)'
                  : color === 'blue'
                    ? 'rgba(59,130,246,0.9)'
                    : 'rgba(34,197,94,0.9)',
            }}
          />
        </Tooltip>
      </Box>
    </Stack>
  );
}

export function GraficoAnalise({ valores, faixas, onSelectNutriente }: Props) {
  const ids = Object.keys(valores);

  return (
    <Stack gap="md">
      <Text fw={700}>Interpretação (0–200%)</Text>
      <Stack gap="sm">
        {ids.map((id) => (
          <NutrientBar
            key={id}
            id={id}
            valor={valores[id]}
            faixa={faixas[id as keyof FaixaIdeal] ?? [0, 0]}
            onClick={() => onSelectNutriente?.(id)}
          />
        ))}
      </Stack>
      <Text size="xs" c="dimmed">
        Verde = dentro do ideal, Vermelho = abaixo, Azul = acima. A faixa
        esverdeada representa o intervalo ideal para o parâmetro selecionado.
      </Text>
    </Stack>
  );
}

export default GraficoAnalise;
