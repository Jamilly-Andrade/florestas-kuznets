import { useMemo, useState } from 'react';
import { scaleLinear, scaleLog } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';
import { SectionHead, Tooltip, useTooltip, CountUp } from '../components/ui.jsx';
import AnimatedContent from '../components/reactbits/AnimatedContent.jsx';
import { paises, curvaQuad, RENDAS, RENDA_COR, STATS, previstoLinear } from '../lib/data.js';
import { num, pct, signed, usd } from '../lib/format.js';
import { useInView, useWidth } from '../lib/hooks.js';

const X_MIN = 900;
const X_MAX = 120000;
const DESTAQUES = ['BRA', 'PRY', 'CHN', 'VNM', 'URY', 'ISL', 'BFA', 'CRI', 'IRL', 'QAT'];

function Dispersao() {
  const [wrapRef, width] = useWidth(1000);
  const [viewRef, seen] = useInView(0.2);
  const { tip, show, hide } = useTooltip();
  const [ocultas, setOcultas] = useState([]);
  const [mostrarQuad, setMostrarQuad] = useState(false);
  const [busca, setBusca] = useState('');
  const [renda, setRenda] = useState(Math.log(5000));

  const H = width < 600 ? 380 : 520;
  const M = { t: 24, r: 18, b: 52, l: 46 };
  const x = scaleLog().domain([X_MIN, X_MAX]).range([M.l, width - M.r]);
  const y = scaleLinear().domain([-2.8, 4.1]).range([H - M.b, M.t]);

  const linear = useMemo(() => {
    const pts = Array.from({ length: 60 }, (_, i) => {
      const v = Math.exp(Math.log(1000) + (i / 59) * (Math.log(105000) - Math.log(1000)));
      return [v, previstoLinear(v)];
    });
    return pts;
  }, []);
  const lineGen = line()
    .x(d => x(d[0]))
    .y(d => y(d[1]))
    .curve(curveMonotoneX);

  const alvo = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return null;
    return paises.find(p => p.nome.toLowerCase().startsWith(q)) ?? paises.find(p => p.nome.toLowerCase().includes(q));
  }, [busca]);

  const pib = Math.exp(renda);
  const prev = previstoLinear(pib);
  const zero = STATS.linear.zero;

  return (
    <div className="chart-card chart-card--scatter" ref={viewRef}>
      <div className="scatter-tools">
        <div className="legend legend--toggle">
          {RENDAS.map(r => {
            const off = ocultas.includes(r);
            return (
              <button
                type="button"
                key={r}
                className={`legend__item ${off ? 'is-off' : ''}`}
                aria-pressed={!off}
                onClick={() => setOcultas(o => (off ? o.filter(v => v !== r) : [...o, r]))}
              >
                <i style={{ background: RENDA_COR[r] }} />
                {r}
              </button>
            );
          })}
        </div>
        <div className="scatter-tools__right">
          <label className="search">
            <span className="sr-only">Procurar país</span>
            <input
              type="search"
              placeholder="Procurar país… ex.: Brasil"
              value={busca}
              onChange={e => setBusca(e.target.value)}
              list="lista-paises"
            />
            <datalist id="lista-paises">
              {paises.map(p => (
                <option key={p.iso} value={p.nome} />
              ))}
            </datalist>
          </label>
          <label className="switch">
            <input type="checkbox" checked={mostrarQuad} onChange={e => setMostrarQuad(e.target.checked)} />
            <span className="switch__ui" />
            curva quadrática
          </label>
        </div>
      </div>

      <div ref={wrapRef} className="scatter">
        <svg width={width} height={H} role="img" aria-label="Dispersão entre PIB per capita e variação anual da floresta">
          <rect x={M.l} y={y(0)} width={width - M.l - M.r} height={y(-2.8) - y(0)} className="area-neg" />
          <rect x={x(zero)} y={M.t} width={width - M.r - x(zero)} height={y(0) - M.t} className="area-pos" />
          {[-2, -1, 1, 2, 3, 4].map(t => (
            <g key={t}>
              <line x1={M.l} x2={width - M.r} y1={y(t)} y2={y(t)} className="grid" />
              <text x={M.l - 8} y={y(t) + 4} className="tick" textAnchor="end">
                {t > 0 ? `+${t}` : t}%
              </text>
            </g>
          ))}
          <line x1={M.l} x2={width - M.r} y1={y(0)} y2={y(0)} className="zero-line" />
          <text x={M.l - 8} y={y(0) + 4} className="tick" textAnchor="end">
            0%
          </text>
          {(width < 600 ? [1000, 5000, 20000, 100000] : [1000, 2000, 5000, 10000, 20000, 50000, 100000]).map(t => (
            <text key={t} x={x(t)} y={H - M.b + 20} className="tick" textAnchor="middle">
              {t >= 1000 ? `${t / 1000} mil` : t}
            </text>
          ))}
          <text x={(width + M.l) / 2} y={H - 8} className="axis-title" textAnchor="middle">
            PIB per capita 2020 (US$ PPC, escala log)
          </text>

          {/* ponto de reversão */}
          <line x1={x(zero)} x2={x(zero)} y1={M.t} y2={H - M.b} className="turn-line" />
          <g transform={`translate(${x(zero) + (x(zero) + 174 > width - M.r ? -174 : 0)} ${M.t + 4})`}>
            <rect x={6} y={0} width={162} height={44} rx={8} className="turn-badge" />
            <text x={16} y={18} className="turn-badge__k">
              ponto de reversão
            </text>
            <text x={16} y={36} className="turn-badge__v">
              {usd(zero, 0)}
            </text>
          </g>

          {/* pontos */}
          <g className={`dots ${seen ? 'is-on' : ''}`}>
            {paises.map((p, i) => {
              const off = ocultas.includes(p.renda);
              const isAlvo = alvo?.iso === p.iso;
              return (
                <circle
                  key={p.iso}
                  cx={x(p.pib2020)}
                  cy={y(p.taxa)}
                  r={isAlvo ? 9 : width < 600 ? 4 : 5.2}
                  fill={RENDA_COR[p.renda]}
                  className={`dot ${off ? 'is-off' : ''} ${alvo && !isAlvo ? 'is-dim' : ''} ${isAlvo ? 'is-target' : ''}`}
                  style={{ transitionDelay: seen ? `${(i % 40) * 12}ms` : '0ms' }}
                  onPointerMove={e =>
                    show(
                      e,
                      <>
                        <strong>{p.nome}</strong>
                        <span>{p.renda}</span>
                        <span>PIB per capita 2020: {usd(p.pib2020)}</span>
                        <span>
                          Floresta: {signed(p.taxa, 2)}% a.a. ({pct(p.varTotal, 1, true)} em 30 anos)
                        </span>
                      </>
                    )
                  }
                  onPointerLeave={hide}
                />
              );
            })}
          </g>
          {/* rótulos de destaque */}
          {!alvo &&
            width >= 700 &&
            paises
              .filter(p => DESTAQUES.includes(p.iso) && !ocultas.includes(p.renda))
              .map(p => (
                <text key={p.iso} x={x(p.pib2020) + 8} y={y(p.taxa) - 8} className="dot-label">
                  {p.nome}
                </text>
              ))}
          {alvo && (
            <text x={x(alvo.pib2020) + 12} y={y(alvo.taxa) - 12} className="dot-label dot-label--target">
              {alvo.nome} · {signed(alvo.taxa, 2)}%
            </text>
          )}

          {/* modelos */}
          <path d={lineGen(linear)} className={`fit fit--linear ${seen ? 'is-on' : ''}`} />
          <path
            d={lineGen(curvaQuad.filter(d => d.pib >= X_MIN).map(d => [d.pib, d.y]))}
            className={`fit fit--quad ${mostrarQuad ? 'is-on' : ''}`}
          />

          {/* simulador */}
          <g transform={`translate(${x(pib)} ${y(prev)})`} className="sim">
            <line y1={0} y2={y(-2.8) - y(prev)} className="sim__drop" />
            <circle r={11} className="sim__halo" />
            <circle r={6} className={`sim__dot ${prev >= 0 ? 'is-pos' : ''}`} />
          </g>
        </svg>
      </div>

      <div className="sim-panel">
        <label className="sim-panel__slider">
          <span>Mova a renda per capita</span>
          <input
            type="range"
            min={Math.log(1000)}
            max={Math.log(105000)}
            step={0.01}
            value={renda}
            onChange={e => setRenda(+e.target.value)}
            style={{
              '--p': `${((renda - Math.log(1000)) / (Math.log(105000) - Math.log(1000))) * 100}%`
            }}
          />
        </label>
        <div className="sim-panel__out">
          <div>
            <span>renda per capita</span>
            <strong>{usd(pib)}</strong>
          </div>
          <div>
            <span>variação prevista pelo modelo linear</span>
            <strong className={prev >= 0 ? 'leaf' : 'fire'}>{signed(prev, 2)}% ao ano</strong>
          </div>
          <div>
            <span>leitura</span>
            <strong className={prev >= 0 ? 'leaf' : 'fire'}>
              {prev >= 0 ? 'expansão florestal líquida' : 'desmatamento líquido'}
            </strong>
          </div>
        </div>
        <p className="caption">
          Modelo 1: taxa anual = −3,3631 + 0,3485 × ln(PIB per capita). Cada ponto do gráfico é um país; a linha verde é a
          reta ajustada.
        </p>
      </div>
      <Tooltip tip={tip} />
    </div>
  );
}

export default function Virada() {
  return (
    <section className="section virada" id="virada">
      <div className="container">
        <SectionHead
          kicker="07 · A pergunta central"
          title="Existe um ponto de virada?"
          lead="No diagrama de dispersão, à esquerda (menor renda) concentra-se quase todo o desmatamento severo. Conforme a renda avança para a direita, os pontos sobem e deixam o campo negativo."
        />

        <div className="stat-row stat-row--3">
          <AnimatedContent className="stat stat--big" distance={30}>
            <span>Pearson (r)</span>
            <strong>
              <CountUp to={STATS.correlacao.pearson} decimals={2} />
            </strong>
            <em>p &lt; 0,0001</em>
          </AnimatedContent>
          <AnimatedContent className="stat stat--big" distance={30} delay={0.08}>
            <span>Spearman (ρ)</span>
            <strong>
              <CountUp to={STATS.correlacao.spearman} decimals={2} />
            </strong>
            <em>associação por postos, ainda mais forte</em>
          </AnimatedContent>
          <AnimatedContent className="stat stat--big" distance={30} delay={0.16}>
            <span>r sem os outliers</span>
            <strong>
              <CountUp to={STATS.correlacao.semOutliers} decimals={2} />
            </strong>
            <em>a relação continua sólida</em>
          </AnimatedContent>
        </div>

        <Dispersao />

        <div className="modelos">
          <AnimatedContent className="modelo modelo--win" distance={50} tilt={6}>
            <span className="tag">Modelo 1 · regressão linear simples</span>
            <h3>A força da renda</h3>
            <dl>
              <div>
                <dt>coeficiente de ln(PIB)</dt>
                <dd>+0,3485</dd>
              </div>
              <div>
                <dt>t · p-valor</dt>
                <dd>6,93 · &lt; 0,001</dd>
              </div>
              <div>
                <dt>R²</dt>
                <dd>0,243</dd>
              </div>
              <div>
                <dt>perda zero em</dt>
                <dd className="leaf">US$ 15.505,91</dd>
              </div>
            </dl>
            <p>
              Cerca de <strong>um quarto (24,3%)</strong> de toda a variação florestal entre 151 países em 30 anos é explicado
              apenas pelo nível de renda.
            </p>
            <span className="modelo__badge">preferível</span>
          </AnimatedContent>
          <AnimatedContent className="modelo" distance={50} delay={0.12} tilt={6}>
            <span className="tag">Modelo 2 · regressão quadrática</span>
            <h3>O teste da curva de Kuznets</h3>
            <dl>
              <div>
                <dt>coeficiente do termo²</dt>
                <dd>−0,0047</dd>
              </div>
              <div>
                <dt>p-valor do termo²</dt>
                <dd className="fire">0,914</dd>
              </div>
              <div>
                <dt>R²</dt>
                <dd>0,244</dd>
              </div>
              <div>
                <dt>perda zero em</dt>
                <dd>US$ 15.261,17</dd>
              </div>
            </dl>
            <p>
              A curvatura não acrescenta nada: o R² sobe só 0,1 ponto e o termo quadrático fica muito longe da significância.
              Ligue a <em>curva quadrática</em> no gráfico: ela praticamente se sobrepõe à reta.
            </p>
          </AnimatedContent>
        </div>

        <AnimatedContent className="verdict" distance={40} blur={6}>
          <p className="verdict__k">a resposta</p>
          <p className="verdict__v">
            Sim. Por volta de <span className="leaf">US$ {num(15500)}</span> per capita, a taxa estimada cruza a linha de perda
            zero, e esse patamar coincide com a entrada na faixa de Renda média-alta.
          </p>
        </AnimatedContent>
      </div>
    </section>
  );
}
