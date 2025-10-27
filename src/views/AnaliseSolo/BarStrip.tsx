import React, { forwardRef } from 'react';

export const DEFAULT_PALETTE = [
  '#8b0000',
  '#b22222',
  '#cc3a14',
  '#d2691e',
  '#da8a1e',
  '#e6a32c',
  '#b6d77a',
  '#9ed3c5',
  '#7cb8d9',
  '#5ba1d1',
  '#3f82cb',
  '#2e63be',
  '#1f49aa',
  '#1b3a8f',
];

type BarStripProps = {
  columns?: number;
  barHeight?: number;
  gap?: number;
  radius?: number;
  fixedPalette?: string[];
  idealRangePct?: [number, number];
  className?: string;
  style?: React.CSSProperties;
};

/** Grade de barras com uma paleta fixa e uma sobreposição para a faixa ideal. */
export const BarStrip = forwardRef<HTMLDivElement, BarStripProps>(
  (
    {
      columns = 14,
      barHeight = 96,
      gap = 8,
      radius = 6,
      fixedPalette,
      idealRangePct,
      className,
      style,
    },
    ref,
  ) => {
    const bars = Array.from({ length: columns }, (_, i) => i);
    const palette = fixedPalette ?? DEFAULT_PALETTE;

    const colorFor = (idx: number) => {
      const t = idx / (columns - 1);
      const k = Math.floor(t * (palette.length - 1));
      return palette[k];
    };

    return (
      <div
        ref={ref}
        className={className}
        style={{
          position: 'relative', // Necessário para o overlay
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap,
          padding: `8px ${gap}px 0 ${gap}px`,
          ...style,
        }}
      >
        {/* Barras de fundo */}
        {bars.map((i) => (
          <div
            key={i}
            style={{
              height: barHeight,
              backgroundColor: colorFor(i),
              borderRadius: radius,
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
            }}
          />
        ))}

        {/* Overlay da Faixa Ideal */}
        {idealRangePct && (
          <div
            style={{
              position: 'absolute',
              top: '8px', // Alinha com o padding do container
              bottom: 0,
              left: `calc(${idealRangePct[0] * 100}% + ${gap / 2}px)`,
              width: `calc(${(idealRangePct[1] - idealRangePct[0]) * 100}%)`,
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
              border: '1px solid white',
              borderRadius: radius,
              boxSizing: 'border-box',
              pointerEvents: 'none',
              boxShadow: '0 0 8px rgba(0,0,0,0.3)',
            }}
          />
        )}
      </div>
    );
  },
);
BarStrip.displayName = 'BarStrip';
