const nf = (min, max) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: min, maximumFractionDigits: max });

export const num = (v, d = 0) => nf(d, d).format(v);
export const pct = (v, d = 1, sign = false) => `${sign && v > 0 ? '+' : ''}${nf(d, d).format(v)}%`;
export const usd = (v, d = 0) => `US$ ${nf(d, d).format(v)}`;
export const signed = (v, d = 2) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${nf(d, d).format(Math.abs(v))}`;
export const ha = v =>
  v >= 1e6 ? `${nf(1, 1).format(v / 1e6)} mi ha` : v >= 1e3 ? `${nf(0, 0).format(v / 1e3)} mil ha` : `${nf(0, 0).format(v)} ha`;
