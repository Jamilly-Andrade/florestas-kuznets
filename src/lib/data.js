import paises from '../data/paises.json';
import curvaQuad from '../data/curva.json';
import evolucao from '../data/evolucao.json';

export { paises, curvaQuad, evolucao };

export const RENDAS = ['Baixa renda', 'Renda média-baixa', 'Renda média-alta', 'Alta renda'];

export const RENDA_COR = {
  'Baixa renda': '#c8743c',
  'Renda média-baixa': '#d9b04f',
  'Renda média-alta': '#93c96d',
  'Alta renda': '#3fb57a'
};

export const TRAJ = ['1. Perda acelerada', '2. Perda moderada', '3. Estável', '4. Ganho florestal'];

export const TRAJ_INFO = {
  '1. Perda acelerada': { label: 'Perda acelerada', regra: '< −0,5% a.a.', cor: '#ef5b3a' },
  '2. Perda moderada': { label: 'Perda moderada', regra: '−0,5% a −0,1% a.a.', cor: '#f0a24a' },
  '3. Estável': { label: 'Estável', regra: '−0,1% a +0,1% a.a.', cor: '#cfc9a8' },
  '4. Ganho florestal': { label: 'Ganho florestal', regra: '> +0,1% a.a.', cor: '#5fd38d' }
};

/* Resultados numéricos reportados no notebook  */
export const STATS = {
  totalInicial: 217,
  total: 151,
  totalComercio: 149,
  taxa: { media: -0.06, mediana: -0.0042, dp: 0.79, q1: -0.32, q3: 0.26, limInf: -1.2, limSup: 1.14 },
  varTotal: { media: 1.06, mediana: -0.13 },
  pib2020: { media: 22241.82, mediana: 14194.16, dp: 21883.64, q1: 5695.56, q3: 34754.75 },
  pib1990: { media: 14864.39, mediana: 8241.8, dp: 17144.29 },
  ate20k: { n: 98, pct: 64.9 },
  acima80k: { n: 3, pct: 2.0 },
  trajetoria: {
    '1. Perda acelerada': { n: 30, pct: 19.9 },
    '2. Perda moderada': { n: 29, pct: 19.2 },
    '3. Estável': { n: 40, pct: 26.5 },
    '4. Ganho florestal': { n: 52, pct: 34.4 }
  },
  perdaTotal: { n: 59, pct: 39.1 },
  renda: {
    'Baixa renda': { n: 22, pct: 14.6, media: -0.74, mediana: -0.69, q1: -1.38, q3: -0.21 },
    'Renda média-baixa': { n: 45, pct: 29.8, media: -0.23, mediana: -0.15, q1: -0.44, q3: 0.0 },
    'Renda média-alta': { n: 40, pct: 26.5, media: -0.01, mediana: 0.0, q1: -0.27, q3: 0.4 },
    'Alta renda': { n: 44, pct: 29.1, media: 0.41, mediana: 0.15, q1: 0.0, q3: 0.42 }
  },
  cruzada: {
    'Baixa renda': [13, 4, 2, 3],
    'Renda média-baixa': [11, 14, 9, 11],
    'Renda média-alta': [6, 8, 12, 14],
    'Alta renda': [0, 3, 17, 24]
  },
  quiQuadrado: { chi2: 48.7, gl: 9, p: '1,89 × 10⁻⁷', cramer: 0.328 },
  correlacao: { pearson: 0.42, spearman: 0.54, semOutliers: 0.35 },
  linear: { b0: -3.3631, b1: 0.3485, r2: 0.243, t: 6.925, zero: 15505.91 },
  quad: { b0: -3.7645, b1: 0.4358, b2: -0.0047, r2: 0.244, pQuad: 0.914, zero: 15261.17 },
  comercio: {
    'Baixa renda': { exp: 47.6, imp: 52.4 },
    'Renda média-baixa': { exp: 48.9, imp: 51.1 },
    'Renda média-alta': { exp: 37.5, imp: 62.5 },
    'Alta renda': { exp: 7.0, imp: 93.0 }
  },
  fase: {
    '4. Pós-transição': { n: 79, pct: 52.3 },
    '3. Transição tardia': { n: 20, pct: 13.2 },
    '2. Transição inicial': { n: 22, pct: 14.6 },
    '1. Pré-transição': { n: 5, pct: 3.3 },
    'Sem classificação': { n: 25, pct: 16.6 }
  },
  regiao: [
    ['Europa e Ásia Central', 45, 29.8],
    ['África Subsaariana', 40, 26.5],
    ['América Latina e Caribe', 23, 15.2],
    ['Leste Asiático e Pacífico', 19, 12.6],
    ['Oriente Médio e Norte da África', 17, 11.3],
    ['Sul da Ásia', 5, 3.3],
    ['América do Norte', 2, 1.3]
  ]
};

export const previstoLinear = pib => STATS.linear.b0 + STATS.linear.b1 * Math.log(pib);

export const porIso = Object.fromEntries(paises.map(p => [p.iso, p]));
