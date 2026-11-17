import { useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';
import { SectionHead, ParallaxImage } from '../components/ui.jsx';
import AnimatedContent from '../components/reactbits/AnimatedContent.jsx';
import { evolucao, porIso, STATS } from '../lib/data.js';
import { num, pct, usd } from '../lib/format.js';
import { useInView, useWidth } from '../lib/hooks.js';

const COR = {
  URY: '#6fe39a',
  CHN: '#c4e66f',
  CRI: '#56c7cf',
  BOL: '#d995b8',
  BRA: '#f0a24a',
  PRY: '#ef5b3a'
};

const SEGUEM = [
  { iso: 'URY', nota: 'O maior salto da amostra: mais que dobrou a área florestal com incentivos ao reflorestamento.' },
  { iso: 'VNM', nota: 'Crescimento contínuo das matas acompanhado de um salto na renda.' },
  { iso: 'CHN', nota: 'Renda multiplicada por mais de 11 vezes e floresta em expansão contínua.' },
  { iso: 'CRI', nota: 'Consolidou um modelo estável de expansão florestal.' }
];
const NAO_SEGUEM = [
  { iso: 'PRY', nota: 'Uma das retrações mais drásticas do continente, com renda já no patamar do ponto de reversão.' },
  { iso: 'BRA', nota: 'Perdeu quase um quinto das florestas mesmo com renda acima do ponto de reversão.' },
  { iso: 'COD', nota: 'Renda per capita encolheu entre 1990 e 2020, e a perda florestal continuou.' },
  { iso: 'BOL', nota: 'Manteve perdas contínuas de vegetação nativa.' }
];

function Linhas() {
  const [wrapRef, width] = useWidth(900);
  const [viewRef, seen] = useInView(0.25);
  const [ano, setAno] = useState(2020);
  const [foco, setFoco] = useState(null);
  const H = width < 600 ? 320 : 440;
  const M = { t: 20, r: width < 600 ? 16 : 110, b: 40, l: 44 };
  const x = scaleLinear().domain([1990, 2020]).range([M.l, width - M.r]);
  const y = scaleLinear().domain([50, 225]).range([H - M.b, M.t]);
  const gen = line()
    .x(d => x(d.ano))
    .y(d => y(d.idx))
    .curve(curveMonotoneX);

  const onMove = e => {
    const r = e.currentTarget.getBoundingClientRect();
    const a = Math.round(x.invert(e.clientX - r.left));
    setAno(Math.max(1990, Math.min(2020, a)));
  };

  const valores = evolucao
    .map(c => ({ ...c, v: c.serie.find(s => s.ano === ano)?.idx }))
    .sort((a, b) => b.v - a.v);

  return (
    <div className="chart-card" ref={viewRef}>
      <div className="chart-card__head">
        <h3>Área de floresta, índice 1990 = 100</h3>
        <p>Base 100 em 1990 para comparar países com territórios e biomas completamente diferentes.</p>
      </div>
      <div className="lines-layout">
        <div ref={wrapRef} className="lines">
          <svg
            width={width}
            height={H}
            onPointerMove={onMove}
            onPointerLeave={() => setAno(2020)}
            role="img"
            aria-label="Trajetória da cobertura florestal de países selecionados entre 1990 e 2020"
          >
            {[50, 100, 150, 200].map(t => (
              <g key={t}>
                <line x1={M.l} x2={width - M.r} y1={y(t)} y2={y(t)} className={t === 100 ? 'zero-line' : 'grid'} />
                <text x={M.l - 8} y={y(t) + 4} className="tick" textAnchor="end">
                  {t}
                </text>
              </g>
            ))}
            {[1990, 2000, 2010, 2020].map(t => (
              <text key={t} x={x(t)} y={H - M.b + 22} className="tick" textAnchor="middle">
                {t}
              </text>
            ))}
            <line x1={x(ano)} x2={x(ano)} y1={M.t} y2={H - M.b} className="crosshair" />
            {evolucao.map(c => {
              const dim = foco && foco !== c.iso;
              return (
                <g key={c.iso} className={`serie ${dim ? 'is-dim' : ''}`}>
                  <path
                    d={gen(c.serie)}
                    stroke={COR[c.iso]}
                    className={`serie__line ${seen ? 'is-on' : ''}`}
                    pathLength={1}
                  />
                  <circle
                    cx={x(ano)}
                    cy={y(c.serie.find(s => s.ano === ano)?.idx ?? 100)}
                    r={4.5}
                    fill={COR[c.iso]}
                    className="serie__pt"
                  />
                  {width >= 600 && (
                    <text x={x(2020) + 10} y={y(c.serie.at(-1).idx) + 4} fill={COR[c.iso]} className="serie__label">
                      {c.nome}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        <div className="lines-panel">
          <span className="lines-panel__ano">{ano}</span>
          {valores.map(c => (
            <button
              type="button"
              key={c.iso}
              className={`lines-panel__row ${foco === c.iso ? 'is-on' : ''}`}
              onPointerEnter={() => setFoco(c.iso)}
              onPointerLeave={() => setFoco(null)}
              onFocus={() => setFoco(c.iso)}
              onBlur={() => setFoco(null)}
            >
              <i style={{ background: COR[c.iso] }} />
              <span>{c.nome}</span>
              <strong>{num(c.v, 1)}</strong>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ iso, nota, tipo, i }) {
  const p = porIso[iso];
  const acima = p.pib2020 >= STATS.linear.zero;
  return (
    <AnimatedContent className={`caso caso--${tipo}`} distance={50} delay={i * 0.08}>
      <div className="caso__top">
        <h4>{p.nome}</h4>
        <span className={`caso__var ${p.varTotal >= 0 ? 'leaf' : 'fire'}`}>{pct(p.varTotal, 1, true)}</span>
      </div>
      <p className="caso__renda">{p.renda}</p>
      <div className="caso__pib">
        <span>{usd(p.pib1990)}</span>
        <i />
        <span>{usd(p.pib2020)}</span>
      </div>
      <div className="caso__meter">
        <i style={{ left: `${Math.min(100, (Math.log(p.pib2020 / 1000) / Math.log(30)) * 100)}%` }} className={acima ? 'is-above' : ''} />
        <b style={{ left: `${(Math.log(STATS.linear.zero / 1000) / Math.log(30)) * 100}%` }} />
      </div>
      <p className="caso__nota">{nota}</p>
    </AnimatedContent>
  );
}

export default function Casos() {
  return (
    <section className="section casos" id="casos">
      <div className="casos__banner">
        <ParallaxImage src="/img/mudas.webp" alt="Mulheres com mudas em um viveiro de reflorestamento na Tanzânia" />
        <div className="container casos__banner-inner">
          <SectionHead
            kicker="08 · Trajetórias reais"
            title="Quem segue a curva e quem não segue"
            lead="A renda é um facilitador, mas não uma garantia automática. Oito países mostram dois caminhos opostos nas últimas três décadas."
          />
        </div>
      </div>

      <div className="container">
        <Linhas />
        <p className="caption">
          O gráfico mostra seis dos oito países. Vietnã e República Democrática do Congo ficaram de fora porque seus nomes
          não coincidem entre a base de séries anuais e a do Banco Mundial. Os dados de 1990 e 2020 deles estão nos cartões
          abaixo.
        </p>

        <div className="casos__cols">
          <div>
            <h3 className="casos__h leaf">Seguem a transição florestal</h3>
            <div className="casos__grid">
              {SEGUEM.map((c, i) => (
                <Card key={c.iso} {...c} tipo="segue" i={i} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="casos__h fire">Desafiam a teoria</h3>
            <div className="casos__grid">
              {NAO_SEGUEM.map((c, i) => (
                <Card key={c.iso} {...c} tipo="nao" i={i} />
              ))}
            </div>
          </div>
        </div>
        <p className="caption">
          A régua em cada cartão mostra o PIB per capita de 2020 (escala log, de US$ 1 mil a US$ 30 mil). O traço vertical marca
          o ponto de reversão de US$ 15.506.
        </p>

        <AnimatedContent className="callout callout--fire" distance={40}>
          <p>
            O caso mais revelador: <strong>Brasil</strong> (US$ 17.328) e <strong>Paraguai</strong> (US$ 14.990) são países de Renda
            média-alta, com renda acima ou praticamente no ponto de reversão, e mesmo assim continuaram em{' '}
            <strong className="fire">perda acelerada</strong> para atender à demanda global por commodities agrícolas e
            pecuárias. Além da renda, pesam a forma como cada país se insere no comércio internacional e a existência de
            políticas ativas de proteção ambiental.
          </p>
        </AnimatedContent>
      </div>
    </section>
  );
}
