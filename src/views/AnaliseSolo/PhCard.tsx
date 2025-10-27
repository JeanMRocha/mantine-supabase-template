import {
  Card,
  Group,
  Text,
  NumberInput,
  Badge,
  Stack,
  Tooltip,
} from '@mantine/core';
import { useMemo } from 'react';

type PhCardProps = {
  value: number;
  onChange: (v: number) => void;
  /** faixa ideal, ex.: [5.5, 6.5] */
  ideal: [number, number];
  /** altura das barras (não altera o layout padrão se você não passar) */
  barsHeight?: number;
};

/** Paleta 0..14 – NÃO altera a largura/altura das barras */
const PH_COLORS = [
  '#8b0000',
  '#b00000',
  '#cc3300',
  '#d85c00',
  '#e07f00',
  '#e6a800',
  '#b9d66d',
  '#8bd48b',
  '#6dc8c3',
  '#57a8e0',
  '#3b86e0',
  '#2f68d6',
  '#274cc8',
  '#2039b0',
  '#1a2c99',
];

function pct(val: number, min = 0, max = 14) {
  const cl = Math.max(min, Math.min(max, val));
  return ((cl - min) / (max - min)) * 100;
}

/**
 * Crescimento da planta: bordas → 50% do ideal; na faixa → 100% do ideal.
 * Em termos de altura relativa do card:
 * - fora da faixa: 25% da altura das barras (metade de 50% ideal)
 * - dentro da faixa: 50% da altura das barras
 */
function growthFactor(value: number, iMin: number, iMax: number) {
  if (value >= iMin && value <= iMax) return 0.5; // 50% da altura das barras (ideal)
  // Fora da faixa: desce proporcionalmente até 25%
  const dist = Math.min(Math.abs(value - iMin), Math.abs(value - iMax));
  // Escala simples: quanto maior a distância da faixa, menor o fator (limitado a 0.25)
  const k = Math.max(0.25, 0.5 - dist * 0.1);
  return k;
}

export default function PhCard({
  value,
  onChange,
  ideal,
  barsHeight = 120,
}: PhCardProps) {
  const [idealMin, idealMax] = ideal;

  const status = useMemo<'baixo' | 'ideal' | 'alto'>(() => {
    if (value < idealMin) return 'baixo';
    if (value > idealMax) return 'alto';
    return 'ideal';
  }, [value, idealMin, idealMax]);

  const statusColor =
    status === 'ideal' ? 'green' : status === 'baixo' ? 'red' : 'blue';
  const statusLabel =
    status === 'ideal' ? 'Ideal' : status === 'baixo' ? 'Ácido' : 'Alcalino';

  // Tamanho final da planta (apenas transform, não afeta as barras)
  const plantScale = growthFactor(value, idealMin, idealMax);

  return (
    <Card withBorder radius="md" p="md">
      {/* Cabeçalho */}
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <Text fw={700}>pH</Text>
          <Badge variant="light">UNID.</Badge>
          <Badge color={statusColor}>{statusLabel.toUpperCase()}</Badge>
        </Group>

        <NumberInput
          value={value}
          onChange={(v) => onChange(Number(v) || 0)}
          step={0.1}
          precision={1}
          min={0}
          max={14}
          maw={120}
        />
      </Group>

      {/* ======= ÁREA VISUAL ======= */}
      <div style={{ position: 'relative', height: barsHeight }}>
        {/* 1) Barras de fundo – layout FIXO (não altera dimensões) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(15, 1fr)',
            height: '100%',
            gap: 2, // mantenha o mesmo gap que você já usa
            // nada de padding/border aqui para não mexer no tamanho
          }}
        >
          {PH_COLORS.map((c, i) => (
            <Tooltip key={i} label={`pH ${i}`} withArrow>
              <div
                style={{
                  background: c,
                  opacity: 0.85,
                  borderRadius: 4, // apenas visual, não muda largura/altura efetiva
                }}
              />
            </Tooltip>
          ))}
        </div>

        {/* 2) Faixa ideal – overlay absoluto (não empurra nada) */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `calc(${pct(idealMin)}%)`,
              width: `calc(${pct(idealMax) - pct(idealMin)}%)`,
              background:
                'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(16,185,129,0.18) 100%)',
              border: '1px solid var(--mantine-color-green-6)',
              borderRadius: 6,
              boxShadow: 'inset 0 0 0 1px rgba(16,185,129,0.35)',
            }}
          />
        </div>

        {/* 3) 🌱 Plantinha – overlay absoluto NA BASE, sem alterar barras */}
        <img
          src="/icons/favicon.svg" // sua plantinha do projeto (public/icons)
          alt="Indicador pH"
          title={`pH: ${value.toFixed(1)}`}
          style={{
            position: 'absolute',
            left: `calc(${pct(value)}% - 64px)`, // centraliza o SVG ~32px
            bottom: 2, // sempre na base
            width: 150,
            height: 150,
            transformOrigin: 'bottom center',
            transform: `scale(${plantScale})`, // cresce/encolhe apenas a planta
            transition: 'transform 260ms ease',
            filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.35))',
            // cor por status (aplicada no svg via filter para não tocar nas barras)
            // se seu svg for flat, dá um leve tinte com drop-shadow; mantemos simples aqui
          }}
        />
      </div>

      {/* Mensagens */}
      <Stack gap={4} mt="sm">
        {status === 'baixo' && (
          <Text size="sm" c="red.6">
            pH ácido — reduz absorção de Ca, Mg, Mo. Considere calagem/PRNT
            adequado e manejo de MO.
          </Text>
        )}
        {status === 'alto' && (
          <Text size="sm" c="blue.6">
            pH alcalino — risco de deficiência de Fe, Mn, Zn. Avalie
            acidificação localizada/quelatos.
          </Text>
        )}
        {status === 'ideal' && (
          <Text size="sm" c="green.6">
            Faixa adequada para a maioria das culturas — manter manejo.
          </Text>
        )}
        <Text size="xs" c="dimmed">
          Faixa ideal configurada: {idealMin}–{idealMax}.
        </Text>
      </Stack>
    </Card>
  );
}
