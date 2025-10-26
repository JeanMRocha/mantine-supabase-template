// src/views/AnaliseSolo/soilConfig.ts
export type Extrator = 'Mehlich-1' | 'Resina' | 'KCl 1M';

export type NutrienteId =
  | 'pH'
  | 'P'
  | 'K'
  | 'Ca'
  | 'Mg'
  | 'MO'
  // micro – já suportados, só ativar no cadastro
  | 'B'
  | 'Zn'
  | 'Mn'
  | 'Cu'
  | 'Fe'
  | 'S'
  | 'Na';

export type FaixaIdeal = Record<NutrienteId, [number, number]>;

export interface ParametrosSolo {
  cultura: string;
  variedade?: string | null;
  uf?: string | null;
  cidade?: string | null;
  altitude?: number | null;
  extrator: Extrator;
}

export const EXTRATORES: Extrator[] = ['Mehlich-1', 'Resina', 'KCl 1M'];

export const MICROS: NutrienteId[] = ['B', 'Zn', 'Mn', 'Cu', 'Fe', 'S', 'Na'];

export const MACROS: NutrienteId[] = ['pH', 'P', 'K', 'Ca', 'Mg', 'MO'];

export const TODA_LISTA: NutrienteId[] = [...MACROS, ...MICROS];

/**
 * Defaults gerais (usados quando não há regra mais específica)
 * Valores ilustrativos – ajuste depois segundo as referências da “quinta aproximação”
 */
const DEFAULTS: Record<Extrator, FaixaIdeal> = {
  'Mehlich-1': {
    pH: [5.5, 6.5],
    P: [10, 30],
    K: [0.2, 0.4],
    Ca: [3, 6],
    Mg: [1, 2],
    MO: [3, 5],
    B: [0.2, 0.6],
    Zn: [1, 5],
    Mn: [5, 50],
    Cu: [0.5, 2],
    Fe: [10, 100],
    S: [10, 30],
    Na: [0, 0.1],
  },
  Resina: {
    pH: [5.5, 6.5],
    P: [20, 40],
    K: [0.2, 0.4],
    Ca: [3, 6],
    Mg: [1, 2],
    MO: [3, 5],
    B: [0.2, 0.6],
    Zn: [1, 5],
    Mn: [5, 50],
    Cu: [0.5, 2],
    Fe: [10, 100],
    S: [10, 30],
    Na: [0, 0.1],
  },
  'KCl 1M': {
    pH: [5.5, 6.5],
    P: [10, 30],
    K: [0.2, 0.4],
    Ca: [3, 6],
    Mg: [1, 2],
    MO: [3, 5],
    B: [0.2, 0.6],
    Zn: [1, 5],
    Mn: [5, 50],
    Cu: [0.5, 2],
    Fe: [10, 100],
    S: [10, 30],
    Na: [0, 0.1],
  },
};

/**
 * Regras específicas – exemplo: Abacate (Fortuna) no RJ com Mehlich-1
 * Adicione outras conforme sua tabela de referência.
 */
const ESPECIFICOS: Array<{
  match: Partial<ParametrosSolo>;
  faixa: Partial<Record<NutrienteId, [number, number]>>;
}> = [
  {
    match: {
      cultura: 'Abacate',
      variedade: 'Fortuna',
      uf: 'RJ',
      extrator: 'Mehlich-1',
    },
    faixa: {
      pH: [5.6, 6.4],
      P: [12, 28],
      K: [0.22, 0.45],
      Ca: [3.2, 6.2],
      Mg: [1.1, 2.1],
      MO: [3.2, 5.2],
    },
  },
];

export function obterFaixasIdeais(p: ParametrosSolo): FaixaIdeal {
  // começa do default do extrator
  const base = { ...DEFAULTS[p.extrator] };

  // aplica overrides específicos quando “bate” com o match
  for (const regra of ESPECIFICOS) {
    const ok =
      (regra.match.cultura ? regra.match.cultura === p.cultura : true) &&
      (regra.match.variedade ? regra.match.variedade === p.variedade : true) &&
      (regra.match.uf ? regra.match.uf === p.uf : true) &&
      (regra.match.extrator ? regra.match.extrator === p.extrator : true);

    if (ok) {
      Object.assign(base, regra.faixa);
    }
  }

  return base;
}

/** Normaliza um valor para 0–200% em relação ao centro da faixa ideal */
export function normalizar200(valor: number, faixa: [number, number]) {
  const [min, max] = faixa;
  const mid = (min + max) / 2;
  if (mid <= 0) return 0;
  return Math.max(0, Math.min(200, (valor / mid) * 100));
}

/** Retorna a cor (status) de acordo com a faixa */
export function corDoStatus(valor: number, faixa: [number, number]) {
  const [min, max] = faixa;
  if (valor < min) return 'red';
  if (valor > max) return 'blue';
  return 'green';
}
