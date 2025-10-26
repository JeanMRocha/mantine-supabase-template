import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { useState } from 'react';

interface GraficoAnaliseProps {
  analise: {
    nutrientes: Record<string, number>;
    faixaIdeal: Record<string, [number, number]>;
  };
  onSelectNutriente?: (nutriente: string) => void;
}

export function GraficoAnalise({
  analise,
  onSelectNutriente,
}: GraficoAnaliseProps) {
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const data = Object.keys(analise.nutrientes).map((key) => {
    const valor = analise.nutrientes[key];
    const [min, max] = analise.faixaIdeal[key];
    return { nutriente: key, valor, min, max };
  });

  const getColor = (valor: number, min: number, max: number, ativo = false) => {
    if (ativo) return '#0ea5e9'; // azul destaque
    if (valor < min) return '#ef4444'; // vermelho
    if (valor > max) return '#9333ea'; // roxo
    return '#22c55e'; // verde (ideal)
  };

  const handleClick = (nutriente: string) => {
    setSelecionado((prev) => (prev === nutriente ? null : nutriente));
    if (onSelectNutriente) onSelectNutriente(nutriente);
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="nutriente" />
        <Tooltip
          cursor={{ fill: 'rgba(0,0,0,0.05)' }}
          contentStyle={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            padding: '6px 10px',
          }}
        />
        <Bar dataKey="valor" onClick={(d) => handleClick(d.nutriente)}>
          {data.map((d, i) => (
            <Cell
              key={i}
              cursor="pointer"
              fill={getColor(
                d.valor,
                d.min,
                d.max,
                d.nutriente === selecionado,
              )}
              stroke={d.nutriente === selecionado ? '#0ea5e9' : 'none'}
              strokeWidth={d.nutriente === selecionado ? 2 : 0}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
