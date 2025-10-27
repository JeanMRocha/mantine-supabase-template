// src/services/soilParamsService.ts
import { supabaseClient } from '../supabase/supabaseClient';
import { rangeToString } from './utils/rangeToString';
import { soilParamsMock } from '../data/soilParamsMock';
import type { SoilParams, RangeMap } from '../types/soil';

type Query = Partial<
  Pick<
    SoilParams,
    'cultura' | 'variedade' | 'estado' | 'cidade' | 'extrator' | 'estagio'
  > & { idade_meses: number | null }
>;

const norm = (v?: string | null) =>
  (v ?? '').toString().trim().toLowerCase() || null;

/**
 * Normaliza o objeto de busca (lowercase, sem acento).
 */
export function normalizeQuery(q: Query): Query {
  return {
    cultura: norm(q.cultura) ?? '',
    variedade: norm(q.variedade),
    estado: norm(q.estado),
    cidade: norm(q.cidade),
    extrator: norm(q.extrator),
    estagio: norm(q.estagio),
    idade_meses: q.idade_meses ?? null,
  };
}

/**
 * Tenta buscar no Supabase a linha mais específica.
 * Estratégia de “degraus”: cultura+variedade+estado+... → cultura+extrator → cultura
 * Se nada aparecer, cai no mock compatível. Nunca quebra a UI.
 */
export async function getSoilParams(query: Query): Promise<SoilParams> {
  const q = normalizeQuery(query);

  // lista de filtros da mais específica para a mais genérica
  const ladders: Query[] = [
    q,
    { cultura: q.cultura, variedade: q.variedade, extrator: q.extrator },
    { cultura: q.cultura, extrator: q.extrator },
    { cultura: q.cultura },
  ];

  try {
    for (const step of ladders) {
      const req = supabaseClient.from('soil_params').select('*').limit(1);

      if (step.cultura) req.eq('cultura', step.cultura);
      if (step.variedade != null) req.eq('variedade', step.variedade);
      if (step.estado != null) req.eq('estado', step.estado);
      if (step.cidade != null) req.eq('cidade', step.cidade);
      if (step.extrator != null) req.eq('extrator', step.extrator);
      if (step.estagio != null) req.eq('estagio', step.estagio);

      const { data, error } = await req;
      if (error) throw error;
      if (data && data.length) {
        const row = data[0];
        // coluna "ideal" deve ser JSONB com mapa { pH:[x,y], P:[x,y], ... }
        const ideal: RangeMap = row.ideal ?? {};
        return {
          id: row.id,
          cultura: row.cultura,
          variedade: row.variedade,
          estado: row.estado,
          cidade: row.cidade,
          extrator: row.extrator,
          estagio: row.estagio,
          idade_meses: row.idade_meses,
          ideal,
          fonte: row.fonte,
          observacoes: row.observacoes,
          updated_at: row.updated_at,
        };
      }
    }
  } catch (err) {
    // segue para fallback
  }

  // Fallback local — procura mock mais específico possível
  const match =
    soilParamsMock.find(
      (m) =>
        (m.cultura ?? '') === (q.cultura ?? '') &&
        (m.variedade ?? null) === (q.variedade ?? null) &&
        (m.estado ?? null) === (q.estado ?? null) &&
        (m.extrator ?? null) === (q.extrator ?? null),
    ) ||
    soilParamsMock.find((m) => (m.cultura ?? '') === (q.cultura ?? '')) ||
    soilParamsMock[0];

  return match;
}

/**
 * Helper opcional: descreve as faixas ideais em texto curto (para logs).
 */
export function summarizeRanges(ideal: RangeMap): string {
  const parts = Object.entries(ideal).map(
    ([k, r]) => `${k}:${rangeToString(r as any)}`,
  );
  return parts.join(' | ');
}
