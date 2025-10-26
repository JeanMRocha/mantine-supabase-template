import {
  Card,
  Group,
  Text,
  NumberInput,
  Badge,
  Stack,
  Tooltip,
} from '@mantine/core';
import { IconPlant2 } from '@tabler/icons-react';
import { useMemo } from 'react';

type PhCardProps = {
  value: number;
  onChange: (v: number) => void;
  ideal: [number, number]; // ex.: [5.5, 6.5]
};

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

/** 0.1 → 0.5 (tamanho da planta vs altura) conforme proximidade à faixa ideal */
function growthFactor(
  value: number,
  iMin: number,
  iMax: number,
  totalMin = 0,
  totalMax = 14,
) {
  const inside = value >= iMin && value <= iMax;
  const delta = inside
    ? 0
    : Math.min(Math.abs(value - iMin), Math.abs(value - iMax));
  const maxDist = Math.max(iMin - totalMin, totalMax - iMax, 0.0001); // evita div/0
  const closeness = Math.max(0, Math.min(1, 1 - delta / maxDist)); // 0..1
  return 0.1 + closeness * 0.4; // 10%..50%
}

export default function PhCard({ value, onChange, ideal }: PhCardProps) {
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

  const plantH = growthFactor(value, idealMin, idealMax); // 0.1..0.5
  const plantScale = plantH * 1.0; // ajuste fino

  return (
    <Card withBorder radius="md" p="md">
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <Text fw={700}>pH</Text>
          <Badge variant="light">unid.</Badge>
          <Badge color={statusColor}>{statusLabel}</Badge>
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

      <div style={{ position: 'relative', height: 120 }}>
        {/* blocos verticais (0..14) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(15, 1fr)`,
            height: '100%',
            gap: 2,
          }}
        >
          {PH_COLORS.map((c, i) => (
            <Tooltip key={i} label={`pH ${i}`}>
              <div style={{ background: c, opacity: 0.85, borderRadius: 4 }} />
            </Tooltip>
          ))}
        </div>

        {/* faixa ideal */}
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

        {/* 🌱 plantinha como marcador */}
        <div
          style={{
            position: 'absolute',
            left: `calc(${pct(value)}% - 12px)`,
            bottom: 4,
            transformOrigin: 'bottom center',
            transform: `scale(${plantScale})`,
            transition: 'transform 160ms ease',
            color:
              status === 'ideal'
                ? 'var(--mantine-color-green-5)'
                : status === 'baixo'
                  ? 'var(--mantine-color-red-5)'
                  : 'var(--mantine-color-blue-5)',
            filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.35))',
            animation:
              status === 'ideal'
                ? 'ps-breathe 1.4s ease-in-out infinite'
                : 'none',
          }}
          title={`pH: ${value.toFixed(1)}`}
        >
          <IconPlant2 size={24} />
        </div>
      </div>

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

      {/* animação "respirar" quando ideal */}
      <style>
        {`
          @keyframes ps-breathe {
            0% { transform: scale(${plantScale}); }
            50% { transform: scale(${plantScale * 1.06}); }
            100% { transform: scale(${plantScale}); }
          }
        `}
      </style>
    </Card>
  );
}
