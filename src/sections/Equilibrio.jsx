import { useMemo, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { bin } from 'd3-array';
import { SectionHead, CountUp, ChipList } from '../components/ui.jsx';
import AnimatedContent from '../components/reactbits/AnimatedContent.jsx';
import { paises, STATS, RENDA_COR } from '../lib/data.js';
import { useInView, useWidth } from '../lib/hooks.js';
import { signed } from '../lib/format.js';

const THRESHOLDS = Array.from({ length: 34 }, (_, i) => +(-2.6 + i * 0.2).toFixed(1));

export default function Equilibrio() {
  const [wrapRef, width] = useWidth(900);
  const [viewRef, seen] = useInView(0.25);
  const [sel, setSel] = useState(null);

  const bins = useMemo(
    () =>
      bin()
        .value(p => p.taxa)
        .domain([-2.6, 4.2])
        .thresholds(THRESHOLDS)(paises)
        .filter(b => b.x0 < 4.2),
    []
  );

  const H = width < 600 ? 300 : 380;
  const M = { t: 40, r: 12, b: 46, l: 36 };
  const x = scaleLinear().domain([-2.6, 4.2]).range([M.l, width - M.r]);
  const yMax = Math.max(...bins.map(b => b.length));
  const y = scaleLinear().domain([0, yMax]).nice().range([H - M.b, M.t]);
  const ticks = [-2, -1, 0, 1, 2, 3, 4];
  const active = sel ?? bins.reduce((a, b) => (b.length > a.length ? b : a), bins[0]);

  return (
    <section className="section equilibrio" id="equilibrio">
      <div className="container">
        <SectionHead
          kicker="03 · O retrato geral"
          title="Um mundo em equilíbrio aparente"
          lead="Antes de olhar para a renda, vale ver o quadro geral. Quando os 151 países são colocados lado a lado, a maior parte se concentra perto da variação zero."
        />

        <div className="duo-stats">
          <AnimatedContent className="duo" distance={40}>
            <span className="duo__label">Média · variação total em 30 anos</span>
            <span className="duo__value leaf">
              <CountUp to={STATS.varTotal.media} decimals={2} prefix="+" suffix="%" />
            </span>
            <span className="duo__note">puxada por poucos outliers de expansão</span>
          </AnimatedContent>
          <AnimatedContent className="duo duo--vs" distance={20} delay={0.15}>
            vs
          </AnimatedContent>
          <AnimatedContent className="duo" distance={40} delay={0.25}>
            <span className="duo__label">Mediana · variação total em 30 anos</span>
            <span className="duo__value fire">−0,13%</span>
            <span className="duo__note">o país típico perdeu floresta</span>
          </AnimatedContent>
        </div>

        <AnimatedContent className="prose metricas-nota" distance={30}>
          <p>
            Esses dois números medem a <strong>variação acumulada</strong>, ou seja, quanto a floresta de cada país mudou
            entre 1990 e 2020. O gráfico e a tabela abaixo usam a <strong>taxa anual composta</strong>, que é o ritmo médio
            dessa mudança a cada ano. Por isso os valores não coincidem.
          </p>
        </AnimatedContent>

        <div className="chart-card" ref={viewRef}>
          <div className="chart-card__head">
            <h3>Distribuição da taxa anual de variação da floresta</h3>
          </div>
          <div className="hist" ref={wrapRef}>
            <svg width={width} height={H} role="img" aria-label="Histograma da taxa anual de variação florestal dos 151 países">
              <rect
                x={x(-2.6)}
                width={x(STATS.taxa.limInf) - x(-2.6)}
                y={M.t}
                height={H - M.b - M.t}
                className="zone zone--neg"
              />
              <rect
                x={x(STATS.taxa.limSup)}
                width={x(4.2) - x(STATS.taxa.limSup)}
                y={M.t}
                height={H - M.b - M.t}
                className="zone zone--pos"
              />
              {width >= 700 && (
                <>
                  <text x={x(-2.5)} y={M.t + 16} className="zone-label">
                    outliers de perda (&lt; −1,20%)
                  </text>
                  <text x={x(4.1)} y={M.t + 16} className="zone-label" textAnchor="end">
                    outliers de ganho (&gt; +1,14%)
                  </text>
                </>
              )}
              {y.ticks(5).map(t => (
                <g key={t}>
                  <line x1={M.l} x2={width - M.r} y1={y(t)} y2={y(t)} className="grid" />
                  <text x={M.l - 8} y={y(t) + 4} className="tick" textAnchor="end">
                    {t}
                  </text>
                </g>
              ))}
              {bins.map((b, i) => {
                const bw = Math.max(1, x(b.x1) - x(b.x0) - 2);
                const h = seen ? y(0) - y(b.length) : 0;
                const neg = b.x1 <= 0;
                return (
                  <rect
                    key={i}
                    x={x(b.x0) + 1}
                    width={bw}
                    y={y(0) - h}
                    height={h}
                    rx={2}
                    className={`bar ${neg ? 'bar--neg' : 'bar--pos'} ${active === b ? 'is-active' : ''}`}
                    style={{ transitionDelay: `${i * 18}ms` }}
                    onPointerEnter={() => setSel(b)}
                    onClick={() => setSel(b)}
                  />
                );
              })}
              <line x1={x(0)} x2={x(0)} y1={M.t - 10} y2={H - M.b} className="zero-line" />
              <text x={x(0) + 6} y={M.t - 14} className="annot">
                {width >= 500 ? 'zero · mediana −0,0042%' : 'zero'}
              </text>
              {ticks.map(t => (
                <text key={t} x={x(t)} y={H - M.b + 20} className="tick" textAnchor="middle">
                  {t > 0 ? `+${t}` : t}%
                </text>
              ))}
              <text x={width < 600 ? width / 2 : (width + M.l) / 2} y={H - 6} className="axis-title" textAnchor="middle">
                variação anual da floresta (% ao ano, 1990–2020)
              </text>
            </svg>
          </div>

          <div className="bin-detail" aria-live="polite">
            <div className="bin-detail__head">
              <strong>
                {signed(active.x0, 1)}% a {signed(active.x1, 1)}% a.a.
              </strong>
              <span>
                {active.length} {active.length === 1 ? 'país' : 'países'}
              </span>
            </div>
            <ChipList
              key={active.x0}
              items={[...active].sort((a, b) => a.taxa - b.taxa)}
              render={p => (
                <span key={p.iso} className="chip" style={{ '--c': RENDA_COR[p.renda] }} title={p.renda}>
                  {p.nome} <em>{signed(p.taxa, 2)}%</em>
                </span>
              )}
            />
          </div>
        </div>

        <p className="stat-row__title">Taxa anual de variação (% ao ano)</p>
        <div className="stat-row">
          {[
            ['Média', '−0,06%'],
            ['Mediana', '−0,0042%'],
            ['Desvio padrão', '0,79%'],
            ['Q1 · Q3', '−0,32% · +0,26%'],
            ['Outliers', '16 países']
          ].map(([k, v], i) => (
            <AnimatedContent key={k} className="stat" distance={30} delay={i * 0.06}>
              <span>{k}</span>
              <strong>{v}</strong>
            </AnimatedContent>
          ))}
        </div>

        <AnimatedContent className="prose" distance={40}>
          <p>
            Com a mediana praticamente nula, o país típico ficou perto do equilíbrio ao longo de 30 anos. As mudanças
            intensas aparecem só nas pontas: <strong className="fire">10 países</strong> abaixo de −1,20% ao ano e{' '}
            <strong className="leaf">6 países</strong> acima de +1,14% ao ano. Como poucos casos extremos distorcem a média, a{' '}
            <strong>mediana</strong> é a medida central mais confiável para esses dados. Mas esse equilíbrio é só aparente.
          </p>
        </AnimatedContent>
      </div>
    </section>
  );
}
