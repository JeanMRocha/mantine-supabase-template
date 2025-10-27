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
  /** Número de colunas (default 14) */
  columns?: number;
  /** Altura das barras (px) — mantenha igual entre cartões */
  barHeight?: number;
  /** Espaço entre barras (px) */
  gap?: number;
  /** Raio das barras */
  radius?: number;
  /** Quando definido, usa paleta fixa (ex.: pH) */
  fixedPalette?: string[];
  /**
   * Quando NÃO usar fixedPalette, gera as cores automaticamente:
   *  - abaixo do ideal: tons quentes (vermelhos/laranjas)
   *  - dentro do ideal: verde
   *  - acima do ideal: tons frios (azuis)
   * Valores em 0..1 relativos ao range total.
   */
  idealRangePct?: [number, number];
  /** Classe/estilo opcional do wrapper */
  className?: string;
  style?: React.CSSProperties;
};

/** Grade de barras com altura/gap idênticos para todos os cartões */
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

    // Paletas auto (somente se NÃO houver fixedPalette)
    const warm = [
      '#8b0000',
      '#a11a16',
      '#b43a15',
      '#c35617',
      '#d0711b',
      '#de8d24',
    ];
    const cool = [
      '#6aa7e0',
      '#4f91d8',
      '#3d7bd0',
      '#2c66c5',
      '#2051b3',
      '#183f97',
    ];
    const green = '#7acb86';

    // Função de cor por coluna
    const colorFor = (idx: number) => {
      if (fixedPalette && fixedPalette[idx]) return fixedPalette[idx];
      if (!idealRangePct) return '#e3e3e3';

      const x = (idx + 0.5) / columns; // centro da barra
      const [s, e] = idealRangePct;

      if (x >= s && x <= e) return green;

      if (x < s) {
        const t = Math.max(0, Math.min(1, (x - 0) / Math.max(1e-6, s - 0)));
        const k = Math.floor(t * (warm.length - 1));
        return warm[k];
      }

      // x > e
      const t = Math.max(0, Math.min(1, (x - e) / Math.max(1e-6, 1 - e)));
      const k = Math.floor(t * (cool.length - 1));
      return cool[k];
    };

    return (
      <div
        ref={ref}
        className={className}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap,
          padding: `8px ${gap}px 0 ${gap}px`,
          ...style,
        }}
      >
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
      </div>
    );
  },
);
BarStrip.displayName = 'BarStrip';
