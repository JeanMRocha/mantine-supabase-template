// Tipagem principal da análise de solo
export interface AnaliseSolo {
  id: number;
  proprietario?: string;
  cpf?: string;
  data_analise?: string;
  codigo_amostra: string;
  profundidade: string;

  cultura: string;
  variedade?: string;
  estado: string;
  cidade: string;
  estagio: 'Pré-plantio' | 'Pós-plantio' | 'Produção';
  idade?: string;
  nutrientes: Record<string, number>;
  faixaIdeal: Record<string, [number, number]>;
  observacoes?: string;
}

// Mock de análises para onboarding e teste offline
// Baseado em analise_base.md
export const analisesMock: AnaliseSolo[] = [
  {
    id: 55566,
    proprietario: 'BRUNNA EMILY SANTOS SILVA',
    cpf: '038.471.701-20',
    data_analise: '27/10/2021',
    codigo_amostra: '55566',
    profundidade: '20-40cm',
    cultura: 'Café',
    variedade: 'Catuaí',
    estado: 'RJ',
    cidade: 'Vassouras',
    estagio: 'Produção',
    nutrientes: {
      'M.O.': 2.0,
      pH: 6.05,
      P: 0.85,
      K: 5.2,
      Ca: 1.9,
      Mg: 0.2,
      Al: 0.5,
      'V%': 57,
    },
    faixaIdeal: {
      'M.O.': [3, 5],
      pH: [5.5, 6.5],
      P: [10, 30], // mg/dm³
      K: [80, 120], // mg/dm³
      Ca: [3, 6], // cmolc/dm³
      Mg: [1, 2], // cmolc/dm³
      Al: [0, 0.2],
      'V%': [50, 70],
    },
    observacoes:
      'Valores de Fósforo (P) e Potássio (K) muito baixos. Magnésio (Mg) baixo.',
  },
  {
    id: 55557,
    proprietario: 'BRUNNA EMILY SANTOS SILVA',
    cpf: '038.471.701-20',
    data_analise: '27/10/2021',
    codigo_amostra: '55557',
    profundidade: '0-20cm',
    cultura: 'Café',
    variedade: 'Catuaí',
    estado: 'RJ',
    cidade: 'Vassouras',
    estagio: 'Produção',
    nutrientes: {
      'M.O.': 1.8,
      pH: 5.35,
      P: 0.35,
      K: 5.0,
      Ca: 1.7,
      Mg: 0.1,
      Al: 0.2,
      'V%': 20,
    },
    faixaIdeal: {
      'M.O.': [3, 5],
      pH: [5.5, 6.5],
      P: [10, 30], // mg/dm³
      K: [80, 120], // mg/dm³
      Ca: [3, 6], // cmolc/dm³
      Mg: [1, 2], // cmolc/dm³
      Al: [0, 0.2],
      'V%': [50, 70],
    },
    observacoes:
      'Acidez elevada (pH baixo), saturação por bases (V%) muito baixa. Fósforo, Potássio e Magnésio em níveis críticos.',
  },
  {
    id: 55558,
    proprietario: 'BRUNNA EMILY SANTOS SILVA',
    cpf: '038.471.701-20',
    data_analise: '27/10/2021',
    codigo_amostra: '55558',
    profundidade: '20-40cm',
    cultura: 'Café',
    variedade: 'Catuaí',
    estado: 'RJ',
    cidade: 'Vassouras',
    estagio: 'Produção',
    nutrientes: {
      'M.O.': 1.7,
      pH: 5.93,
      P: 0.33,
      K: 5.6,
      Ca: 1.3,
      Mg: 0.1,
      Al: 0.2,
      'V%': 10,
    },
    faixaIdeal: {
      'M.O.': [3, 5],
      pH: [5.5, 6.5],
      P: [10, 30], // mg/dm³
      K: [80, 120], // mg/dm³
      Ca: [3, 6], // cmolc/dm³
      Mg: [1, 2], // cmolc/dm³
      Al: [0, 0.2],
      'V%': [50, 70],
    },
    observacoes:
      'Saturação por bases (V%) extremamente baixa. Fósforo, Potássio e Magnésio em níveis críticos.',
  },
];
