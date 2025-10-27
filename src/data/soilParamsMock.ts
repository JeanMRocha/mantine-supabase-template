// src/data/soilParamsMock.ts
import { SoilParams } from '../types/soil';

export const soilParamsMock: SoilParams[] = [
  {
    cultura: 'abacate',
    variedade: null,
    estado: null,
    cidade: null,
    extrator: 'mehlich-1',
    estagio: 'produção',
    idade_meses: null,
    ideal: {
      pH: [5.5, 6.5],
      N: [20, 40], // ⬅️ mock simples p/ demonstração
      P: [10, 30],
      K: [0.2, 0.4],
      Ca: [3, 6],
      Mg: [1, 2],
      MO: [3, 5],
    },
    fonte: 'Padrão (mock) — maioria das culturas',
    observacoes: 'Faixas genéricas para funcionamento offline.',
  },
  {
    cultura: 'abacate',
    variedade: 'fortuna',
    estado: 'sp',
    cidade: null,
    extrator: 'mehlich-1',
    estagio: 'produção',
    ideal: {
      pH: [5.5, 6.2],
      N: [25, 45], // ⬅️ mock específico
      P: [12, 25],
      K: [0.25, 0.45],
      Ca: [3.5, 6],
      Mg: [1.2, 2.2],
      MO: [3, 5],
    },
    fonte: 'Mock específico para demo',
  },
];
