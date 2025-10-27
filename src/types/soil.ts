// src/types/soil.ts
export type NutrientKey =
  | 'pH'
  | 'N'
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
  | 'Zn'
  | 'Na'
  | 'Al';

export type Range = [number, number];
export type RangeMap = Partial<Record<NutrientKey, Range>>;

export interface SoilParams {
  id?: string | number;
  cultura: string;
  variedade?: string | null;
  estado?: string | null;
  cidade?: string | null;
  extrator?: string | null;
  estagio?: string | null;
  idade_meses?: number | null;
  ideal: RangeMap;
  fonte?: string | null;
  observacoes?: string | null;
  updated_at?: string | null;
}
