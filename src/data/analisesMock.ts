// Tipagem principal da análise de solo
export interface AnaliseSolo {
  id: number;
  cultura: string;
  variedade?: string;
  estado: string;
  cidade: string;
  estagio: 'Pré-plantio' | 'Pós-plantio';
  idade: string;
  nutrientes: Record<string, number>;
  faixaIdeal: Record<string, [number, number]>;
  observacoes?: string;
}

// Mock de análises para onboarding e teste offline
export const analisesMock: AnaliseSolo[] = [
  {
    id: 1,
    cultura: 'Abacate',
    variedade: 'Fortuna',
    estado: 'RJ',
    cidade: 'Santa Maria Madalena',
    estagio: 'Pós-plantio',
    idade: '2 anos',
    nutrientes: {
      pH: 5.1,
      P: 7,
      K: 0.12,
      Ca: 2.1,
      Mg: 0.7,
      MO: 2.8,
    },
    faixaIdeal: {
      pH: [5.5, 6.5],
      P: [10, 30],
      K: [0.2, 0.4],
      Ca: [3, 6],
      Mg: [1, 2],
      MO: [3, 5],
    },
    observacoes:
      'Baixo fósforo e potássio. Recomendado iniciar adubação de cobertura leve.',
  },
  {
    id: 2,
    cultura: 'Milho',
    estado: 'RJ',
    cidade: 'Campos dos Goytacazes',
    estagio: 'Pré-plantio',
    idade: '—',
    nutrientes: {
      pH: 4.9,
      P: 5,
      K: 0.18,
      Ca: 1.5,
      Mg: 0.5,
      MO: 2.0,
    },
    faixaIdeal: {
      pH: [5.5, 6.2],
      P: [10, 25],
      K: [0.25, 0.5],
      Ca: [2, 5],
      Mg: [0.8, 1.5],
      MO: [3, 6],
    },
    observacoes:
      'Necessita calagem e correção de fósforo. Ideal elevar V% para 60–70%.',
  },
];
