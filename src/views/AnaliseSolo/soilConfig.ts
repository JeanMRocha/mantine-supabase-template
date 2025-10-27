// src/services/soilStandardsService.ts
import { supabaseClient } from '@supabase/supabaseClient';

export type SoilParam =
  | 'pH'
  | 'P'
  | 'K'
  | 'Ca'
  | 'Mg'
  | 'MO'
  | 'S'
  | 'B'
  | 'Cu'
  | 'Fe'
  | 'Mn'
  | 'Zn';

export type IdealRange = { min: number; max: number; unidade?: string };

export type ContextoSolo = {
  cultura?: string;
  variedade?: string;
  extrator?: string; // Mehlich-1, Resin, etc.
  estado?: string;
  cidade?: string;
  altitude?: number;
  idadeMeses?: number; // idade da planta
};

type RegistroSupabase = {
  id: string;
  parametro: SoilParam;
  unidade: string | null;
  ideal_min: number;
  ideal_max: number;
  cultura: string | null;
  variedade: string | null;
  extrator: string | null;
  estado: string | null;
  cidade: string | null;
  idade_min: number | null;
  idade_max: number | null;
};

// ---- MOCK DEFAULT (fallback seguro) ----
const DEFAULTS: Record<SoilParam, IdealRange> = {
  pH: { min: 5.5, max: 6.5, unidade: 'pH' },
  P: { min: 10, max: 30, unidade: 'mg/dm³' },
  K: { min: 0.2, max: 0.4, unidade: 'cmolc/dm³' },
  Ca: { min: 3, max: 6, unidade: 'cmolc/dm³' },
  Mg: { min: 1, max: 2, unidade: 'cmolc/dm³' },
  MO: { min: 3, max: 5, unidade: '%' },
  S: { min: 10, max: 20, unidade: 'mg/dm³' },
  B: { min: 0.2, max: 0.6, unidade: 'mg/dm³' },
  Cu: { min: 0.4, max: 1.2, unidade: 'mg/dm³' },
  Fe: { min: 4, max: 12, unidade: 'mg/dm³' },
  Mn: { min: 2, max: 10, unidade: 'mg/dm³' },
  Zn: { min: 1, max: 3, unidade: 'mg/dm³' },
};

// cache simples em memória por sessão
const cache = new Map<string, IdealRange & { source: 'supabase' | 'mock' }>();

function key(param: SoilParam, ctx: ContextoSolo) {
  return JSON.stringify([param, ctx]);
}

/**
 * Busca 1 parâmetro no Supabase com filtros por contexto.
 * Se nada vier, devolve o mock DEFAULTS[param].
 * Nunca lança erro: sempre retorna um objeto válido + metadado de origem.
 */
export async function getIdealRange(
  parametro: SoilParam,
  ctx: ContextoSolo = {},
): Promise<IdealRange & { source: 'supabase' | 'mock' }> {
  const k = key(parametro, ctx);
  const cached = cache.get(k);
  if (cached) return cached;

  try {
    // Tabela sugerida: solo_referencias (veja o SQL na seção 3)
    // Estratégia: filtrar usando os campos disponíveis. Só aplica where para campos informados.
    let query = supabaseClient
      .from('solo_referencias')
      .select('*')
      .eq('parametro', parametro)
      .limit(1);

    if (ctx.cultura) query = query.eq('cultura', ctx.cultura);
    if (ctx.variedade) query = query.eq('variedade', ctx.variedade);
    if (ctx.extrator) query = query.eq('extrator', ctx.extrator);
    if (ctx.estado) query = query.eq('estado', ctx.estado);
    if (ctx.cidade) query = query.eq('cidade', ctx.cidade);

    // Idade: encaixa em faixa [idade_min, idade_max] quando existir
    if (typeof ctx.idadeMeses === 'number') {
      query = query
        .lte('idade_min', ctx.idadeMeses)
        .gte('idade_max', ctx.idadeMeses);
    }

    const { data, error } = await query;

    if (error) {
      // log local e fallback
      try {
        const { registrarLogLocal } = await import('@services/loggerLocal');
        registrarLogLocal({
          tipo: 'warning',
          mensagem: 'Falha ao consultar solo_referencias no Supabase',
          origem: 'soilStandardsService.getIdealRange',
          detalhes: { error: error.message, parametro, ctx },
        });
      } catch (_) {}
    }

    const rec = (data as unknown as RegistroSupabase[])?.[0];
    if (rec) {
      const result = {
        min: rec.ideal_min,
        max: rec.ideal_max,
        unidade: rec.unidade ?? DEFAULTS[parametro].unidade,
        source: 'supabase' as const,
      };
      cache.set(k, result);
      return result;
    }
  } catch (e: any) {
    try {
      const { registrarLogLocal } = await import('@services/loggerLocal');
      registrarLogLocal({
        tipo: 'error',
        mensagem: e?.message ?? 'Erro desconhecido',
        origem: 'soilStandardsService.getIdealRange',
        detalhes: { parametro, ctx },
      });
    } catch (_) {}
  }

  // Fallback
  const fallback = { ...DEFAULTS[parametro], source: 'mock' as const };
  cache.set(k, fallback);
  return fallback;
}

/** Busca vários parâmetros de uma vez (útil quando você renderiza cards em grade) */
export async function getIdealRanges(
  params: SoilParam[],
  ctx: ContextoSolo = {},
): Promise<Record<SoilParam, IdealRange & { source: 'supabase' | 'mock' }>> {
  const out = {} as Record<
    SoilParam,
    IdealRange & { source: 'supabase' | 'mock' }
  >;
  await Promise.all(
    params.map(async (p) => {
      out[p] = await getIdealRange(p, ctx);
    }),
  );
  return out;
}
