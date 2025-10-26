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

type NutrientCardProps = {
  name: string; // ex: "K"
  unit?: string; // ex: "mg/dm³"
  value: number; // valor do laudo
  onChange: (v: number) => void;
  ideal: [number, number]; // faixa ideal
  scale?: [number, number]; // escala total (default 0..2*idealMax)
  blocks?: number; // quantidade de blocos (default 20)
  palette?: (index: number, total: number) => string; // cor por bloco
  info?: { low?: string; high?: string; ideal?: string };
};

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}
function pct(val: number, min: number, max: number) {
  return ((clamp(val, min, max) - min) / (max - min)) * 100;
}

/** 0.1 → 0.5 (crescimento da planta) */
function growthFactor(
  value: number,
  iMin: number,
  iMax: number,
  totalMin: number,
  totalMax: number,
) {
  const inside = value >= iMin && value <= iMax;
  const delta = inside
    ? 0
    : Math.min(Math.abs(value - iMin), Math.abs(value - iMax));
  const maxDist = Math.max(iMin - totalMin, totalMax - iMax, 0.0001);
  const closeness = clamp(1 - delta / maxDist, 0, 1);
  return 0.1 + closeness * 0.4;
}

export default function NutrientCard({
  name,
  unit = 'mg/dm³',
  value,
  onChange,
  ideal,
  scale,
  blocks = 20,
  palette,
  info,
}: NutrientCardProps) {
  const [iMin, iMax] = ideal;
  const totalMin = scale?.[0] ?? 0;
  const totalMax = scale?.[1] ?? Math.max(iMax * 2, 1);

  const status = useMemo<'baixo' | 'ideal' | 'alto'>(() => {
    if (value < iMin) return 'baixo';
    if (value > iMax) return 'alto';
    return 'ideal';
  }, [value, iMin, iMax]);

  const statusColor =
    status === 'ideal' ? 'green' : status === 'baixo' ? 'red' : 'blue';
  const statusLabel =
    status === 'ideal' ? 'Ideal' : status === 'baixo' ? 'Baixo' : 'Alto';

  const blockColors = (idx: number, tot: number) =>
    palette ? palette(idx, tot) : 'var(--mantine-color-dark-5)';

  const plantH = growthFactor(value, iMin, iMax, totalMin, totalMax);
  const plantScale = plantH * 1.0;

  return (
    <Card withBorder radius="md" p="md">
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <Text fw={700}>{name}</Text>
          <Badge variant="light">{unit}</Badge>
          <Badge color={statusColor}>{statusLabel}</Badge>
        </Group>
        <NumberInput
          value={value}
          onChange={(v) => onChange(Number(v) || 0)}
          step={0.1}
          precision={2}
          min={0}
          maw={140}
        />
      </Group>

      <div style={{ position: 'relative', height: 120 }}>
        {/* blocos verticais */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${blocks}, 1fr)`,
            height: '100%',
            gap: 2,
          }}
        >
          {Array.from({ length: blocks }).map((_, i) => (
            <Tooltip
              key={i}
              label={`${name} – ${(totalMin + ((i + 1) / blocks) * (totalMax - totalMin)).toFixed(2)} ${unit}`}
            >
              <div
                style={{
                  background: blockColors(i, blocks),
                  opacity: 0.5,
                  borderRadius: 4,
                }}
              />
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
              left: `calc(${pct(iMin, totalMin, totalMax)}%)`,
              width: `calc(${pct(iMax, totalMin, totalMax) - pct(iMin, totalMin, totalMax)}%)`,
              background:
                'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(16,185,129,0.16) 100%)',
              border: '1px dashed var(--mantine-color-green-6)',
              borderRadius: 6,
            }}
          />
        </div>

        {/* 🌱 plantinha marcador */}
        <div
          style={{
            position: 'absolute',
            left: `calc(${pct(value, totalMin, totalMax)}% - 12px)`,
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
                ? 'nut-breathe 1.4s ease-in-out infinite'
                : 'none',
          }}
          title={`${name}: ${value} ${unit}`}
        >
          <IconPlant2 size={24} />
        </div>
      </div>

      <Stack gap={4} mt="sm">
        {status === 'baixo' && (
          <Text size="sm" c="red.6">
            {info?.low ?? `${name} abaixo do ideal — considerar correção.`}
          </Text>
        )}
        {status === 'alto' && (
          <Text size="sm" c="blue.6">
            {info?.high ?? `${name} elevado — risco de antagonismo.`}
          </Text>
        )}
        {status === 'ideal' && (
          <Text size="sm" c="green.6">
            {info?.ideal ?? `${name} em faixa adequada.`}
          </Text>
        )}
        <Text size="xs" c="dimmed">
          Faixa ideal: {iMin}–{iMax} {unit} | Escala: {totalMin}–{totalMax}{' '}
          {unit}
        </Text>
      </Stack>

      <style>
        {`
          @keyframes nut-breathe {
            0% { transform: scale(${plantScale}); }
            50% { transform: scale(${plantScale * 1.06}); }
            100% { transform: scale(${plantScale}); }
          }
        `}
      </style>
    </Card>
  );
}
