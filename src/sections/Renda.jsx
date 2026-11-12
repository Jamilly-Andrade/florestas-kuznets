import { useMemo, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { quantile } from 'd3-array';
import { SectionHead, CountUp, Tooltip, useTooltip } from '../components/ui.jsx';
import AnimatedContent from '../components/reactbits/AnimatedContent.jsx';
import { paises, RENDAS, RENDA_COR, STATS, TRAJ, TRAJ_INFO } from '../lib/data.js';
import { num, pct, signed, usd } from '../lib/format.js';
import { useInView, useWidth } from '../lib/hooks.js';

function Empilhado() {
  const [ref, seen] = useInView(0.35);
  const { tip, show, hide } = useTooltip();
  return (
    <div className="stack" ref={ref}>
      <div className="legend">
        {TRAJ.map(t => (
          <span key={t} className="legend__item">
            <i style={{ background: TRAJ_INFO[t].cor }} />
            {TRAJ_INFO[t].label}
          </span>
        ))}
      </div>
      {RENDAS.map((r, ri) => {
        const linha = STATS.cruzada[r];
        const total = linha.reduce((a, b) => a + b, 0);
        return (
          <div key={r} className="stack__row">
            <div className="stack__label">
              <strong>{r}</strong>
              <span>{total} países</span>
            </div>
            <div className="stack__bar">
              {linha.map((n, i) => {
                const p = (n / total) * 100;
                return (
                  <div
                    key={TRAJ[i]}
                    className="stack__seg"
                    style={{
                      width: seen ? `${p}%` : 0,
                      background: TRAJ_INFO[TRAJ[i]].cor,
                      transitionDelay: `${ri * 0.15 + i * 0.08}s`
                    }}
                    onPointerMove={e =>
                      show(
                        e,
                        <>
                          <strong>{r}</strong>
                          <span>
                            {TRAJ_INFO[TRAJ[i]].label}: {n} de {total} países ({pct(p)})
                          </span>
                        </>
                      )
                    }
                    onPointerLeave={hide}
                  >
                    {p >= 9 && <span>{pct(p, 0)}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <Tooltip tip={tip} />
    </div>
  );
}

function Boxplots() {
  const [wrapRef, width] = useWidth(900);
  const [viewRef, seen] = useInView(0.2);
  const [hover, setHover] = useState(null);
  const { tip, show, hide } = useTooltip();
  const rowH = width < 600 ? 104 : 120;
  const M = { t: 20, r: 16, b: 44, l: width < 600 ? 12 : 150 };
  const H = M.t + M.b + rowH * RENDAS.length;
  const x = scaleLinear().domain([-2.7, 4.1]).range([M.l, width - M.r]);

  const grupos = useMemo(
    () =>
      RENDAS.map(r => {
        const vals = paises.filter(p => p.renda === r).sort((a, b) => a.taxa - b.taxa);
        const t = vals.map(v => v.taxa);
        const q1 = quantile(t, 0.25);
        const q3 = quantile(t, 0.75);
        const iqr = q3 - q1;
        const lo = Math.min(...t.filter(v => v >= q1 - 1.5 * iqr));
        const hi = Math.max(...t.filter(v => v <= q3 + 1.5 * iqr));
        // dispersão vertical determinística (beeswarm simples)
        const placed = [];
        const pts = vals.map(p => {
          const px = x(p.taxa);
          let dy = 0;
          const gap = width < 600 ? 4.6 : 6.5;
          const limit = rowH / 2 - (width < 600 ? 20 : 10);
          let found = false;
          for (let k = 0; k < 60; k += 1) {
            const cand = (k % 2 ? 1 : -1) * Math.ceil(k / 2) * gap;
            if (Math.abs(cand) > limit) break;
            if (!placed.some(q => Math.abs(q.px - px) < gap + 0.5 && Math.abs(q.dy - cand) < gap)) {
              dy = cand;
              found = true;
              break;
            }
          }
          // sem espaço livre: posição determinística dentro da faixa
          if (!found) dy = (((placed.length * 37) % 100) / 100 - 0.5) * 2 * limit;
          placed.push({ px, dy });
          return { ...p, px, dy };
        });
        return { r, q1, q3, med: quantile(t, 0.5), lo, hi, pts };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width]
  );

  return (
    <div className="chart-card" ref={viewRef}>
      <div className="chart-card__head">
        <h3>Variação anual da floresta por faixa de renda</h3>
        <p>Cada ponto é um país. As caixas vão do 1º ao 3º quartil, e a linha branca marca a mediana.</p>
      </div>
      <div ref={wrapRef} className="box-wrap">
        <svg width={width} height={H} role="img" aria-label="Boxplots da taxa anual de variação florestal por faixa de renda">
          {[-2, -1, 0, 1, 2, 3, 4].map(t => (
            <g key={t}>
              <line x1={x(t)} x2={x(t)} y1={M.t} y2={H - M.b} className={t === 0 ? 'zero-line' : 'grid'} />
              <text x={x(t)} y={H - M.b + 20} className="tick" textAnchor="middle">
                {t > 0 ? `+${t}` : t}%
              </text>
            </g>
          ))}
          <text x={(width + M.l) / 2} y={H - 6} className="axis-title" textAnchor="middle">
            variação anual da floresta (% ao ano)
          </text>
          {grupos.map((g, i) => {
            const cy = M.t + rowH * i + rowH / 2;
            const c = RENDA_COR[g.r];
            return (
              <g key={g.r} className={`box ${seen ? 'is-on' : ''}`} style={{ '--d': `${i * 0.18}s` }}>
                {width >= 600 ? (
                  <text x={M.l - 16} y={cy + 4} className="box__label" textAnchor="end">
                    {g.r}
                  </text>
                ) : (
                  <text x={M.l} y={cy - rowH / 2 + 14} className="box__label">
                    {g.r}
                  </text>
                )}
                <line x1={x(g.lo)} x2={x(g.hi)} y1={cy} y2={cy} stroke={c} className="box__whisker" />
                <rect
                  x={x(g.q1)}
                  width={Math.max(2, x(g.q3) - x(g.q1))}
                  y={cy - 22}
                  height={44}
                  rx={6}
                  fill={c}
                  className="box__rect"
                />
                <line x1={x(g.med)} x2={x(g.med)} y1={cy - 22} y2={cy + 22} className="box__median" />
                {g.pts.map(p => (
                  <circle
                    key={p.iso}
                    cx={p.px}
                    cy={cy + p.dy}
                    r={hover === p.iso ? 6 : width < 600 ? 2.6 : 3.6}
                    fill={c}
                    className="box__pt"
                    onPointerMove={e => {
                      setHover(p.iso);
                      show(
                        e,
                        <>
                          <strong>{p.nome}</strong>
                          <span>
                            {signed(p.taxa, 2)}% a.a. · {pct(p.varTotal, 1, true)} em 30 anos
                          </span>
                          <span>PIB per capita 2020: {usd(p.pib2020)}</span>
                        </>
                      );
                    }}
                    onPointerLeave={() => {
                      setHover(null);
                      hide();
                    }}
                  />
                ))}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="box-legend">
        {RENDAS.map(r => (
          <div key={r} className="box-legend__item" style={{ '--c': RENDA_COR[r] }}>
            <strong>{r}</strong>
            <span>
              mediana {signed(STATS.renda[r].mediana, 2)}% · média {signed(STATS.renda[r].media, 2)}%
            </span>
          </div>
        ))}
      </div>
      <Tooltip tip={tip} />
    </div>
  );
}

export default function Renda() {
  return (
    <section className="section renda" id="renda">
      <div className="container">
        <SectionHead
          kicker="06 · O divisor"
          title="A renda separa os destinos"
          lead="Ao cruzar a faixa de renda (Banco Mundial, 2020) com a trajetória florestal, a cor vermelha recua faixa a faixa até desaparecer."
        />
        <Empilhado />

        <div className="zero">
          <AnimatedContent className="zero__num" distance={0} scale={0.6} blur={20} duration={1.4}>
            0
          </AnimatedContent>
          <div className="zero__text">
            <AnimatedContent distance={40}>
              <h3>
                países de alta renda com <span className="fire">perda acelerada</span>
              </h3>
            </AnimatedContent>
            <AnimatedContent distance={40} delay={0.15}>
              <p>
                Dos 44 países ricos, <strong>nenhum</strong> está em perda acelerada. Só 3 (6,8%) têm perda moderada, e{' '}
                <strong className="leaf">mais de 90%</strong> mantiveram suas matas estáveis (17) ou em expansão (24). Na Baixa
                renda é o contrário: <strong className="fire">13 de 22</strong> (59,1%) sofreram desmatamento grave.
              </p>
            </AnimatedContent>
          </div>
        </div>

        <div className="teste">
          <AnimatedContent className="teste__intro" distance={40}>
            <span className="tag">teste do qui-quadrado de independência</span>
            <p>Esse padrão poderia ser obra do acaso? O teste diz que não.</p>
          </AnimatedContent>
          <div className="stat-row stat-row--4">
            <AnimatedContent className="stat stat--big" distance={30}>
              <span>χ²</span>
              <strong>
                <CountUp to={STATS.quiQuadrado.chi2} decimals={2} />
              </strong>
            </AnimatedContent>
            <AnimatedContent className="stat stat--big" distance={30} delay={0.08}>
              <span>graus de liberdade</span>
              <strong>{STATS.quiQuadrado.gl}</strong>
            </AnimatedContent>
            <AnimatedContent className="stat stat--big stat--sci" distance={30} delay={0.16}>
              <span>p-valor</span>
              <strong>{STATS.quiQuadrado.p}</strong>
            </AnimatedContent>
            <AnimatedContent className="stat stat--big" distance={30} delay={0.24}>
              <span>V de Cramér</span>
              <strong>
                <CountUp to={STATS.quiQuadrado.cramer} decimals={3} />
              </strong>
            </AnimatedContent>
          </div>
          <AnimatedContent className="prose" distance={30}>
            <p>
              O p-valor praticamente nulo descarta que o resultado tenha acontecido por acaso, e o V de Cramér de 0,328 indica
              uma associação <strong>de moderada a forte</strong> entre riqueza econômica e conservação florestal.
            </p>
          </AnimatedContent>
        </div>

        <Boxplots />

        <AnimatedContent className="prose prose--cols" distance={40}>
          <p>
            Descendo pelas faixas, as caixas migram do campo negativo para o positivo. Em <strong>Baixa renda</strong>, até o 3º
            quartil é negativo (−0,21%). Na <strong>Renda média-baixa</strong>, a perda continua sendo a regra, mas desacelera
            (mediana −0,15%).
          </p>
          <p>
            Na <strong>Renda média-alta</strong>, a mediana fica exatamente em 0,00%: perdas e ganhos se equilibram. Na{' '}
            <strong>Alta renda</strong>, com o 1º quartil em 0,00% e o 3º em +0,42%, pelo menos 75% dos países ricos mantiveram
            florestas estáveis ou em expansão, e todos os seus outliers são de <em>ganho</em> (Espanha, Irlanda, Kuwait,
            Uruguai e Islândia).
          </p>
        </AnimatedContent>
        <p className="caption center">
          {num(151)} países · taxa média anual composta de variação da área florestal entre 1990 e 2020
        </p>
      </div>
    </section>
  );
}
