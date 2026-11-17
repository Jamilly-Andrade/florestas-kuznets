import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { line, curveCatmullRom } from 'd3-shape';
import { SectionHead } from '../components/ui.jsx';
import AnimatedContent from '../components/reactbits/AnimatedContent.jsx';
import { prefersReducedMotion } from '../lib/hooks.js';

gsap.registerPlugin(ScrollTrigger);

const ESTAGIOS = [
  {
    letra: 'A',
    nome: 'Estágio inicial',
    sub: 'baixa renda',
    texto: 'A economia é predominantemente de subsistência, o que gera pouco impacto ambiental em larga escala.'
  },
  {
    letra: 'B',
    nome: 'Industrialização e expansão agrícola',
    sub: 'renda intermediária',
    texto:
      'Com o aumento da renda, lavouras e indústrias avançam sobre a mata e a perda florestal chega ao seu pico.'
  },
  {
    letra: 'C',
    nome: 'Ponto de inflexão',
    sub: 'a virada',
    texto:
      'Mais renda e educação, regras ambientais mais exigentes e a passagem para uma economia de serviços ajudam a frear o desmatamento.'
  },
  {
    letra: 'D',
    nome: 'Estágio avançado',
    sub: 'alta renda',
    texto: 'A perda para e o país passa a recuperar cobertura vegetal, vivendo a Transição Florestal.'
  }
];

// curva esquemática (ilustrativa) da taxa de variação florestal em função da renda
const PONTOS = [
  [0, -0.08],
  [0.1, -0.22],
  [0.3, -1],
  [0.47, -0.62],
  [0.62, 0],
  [0.8, 0.42],
  [1, 0.62]
];

const W = 640;
const H = 420;
const M = { t: 30, r: 24, b: 50, l: 50 };
const sx = x => M.l + x * (W - M.l - M.r);
const sy = y => M.t + ((0.75 - y) / 1.85) * (H - M.t - M.b);

export default function Hipotese() {
  const pinRef = useRef(null);
  const pathRef = useRef(null);
  const dotRef = useRef(null);
  const trailRef = useRef(null);
  const [stage, setStage] = useState(0);
  const stageRef = useRef(0);
  const tlRef = useRef(null);
  const [done, setDone] = useState(false);

  const d = useMemo(() => line().x(p => sx(p[0])).y(p => sy(p[1])).curve(curveCatmullRom.alpha(0.5))(PONTOS), []);

  useEffect(() => {
    const path = pathRef.current;
    const len = path.getTotalLength();
    const trail = trailRef.current;
    trail.style.strokeDasharray = `${len}`;

    const place = progress => {
      const p = path.getPointAtLength(len * progress);
      dotRef.current.setAttribute('transform', `translate(${p.x} ${p.y})`);
      trail.style.strokeDashoffset = `${len * (1 - progress)}`;
      const s = Math.min(3, Math.floor(progress * 4 * 0.999));
      if (s !== stageRef.current) {
        stageRef.current = s;
        setStage(s);
      }
    };

    if (prefersReducedMotion()) {
      place(1);
      setDone(true);
      return undefined;
    }

    // autoplay: o ponto percorre a curva sozinho, com uma pausa em cada estágio (~7s no total)
    const state = { p: 0 };
    const tl = gsap.timeline({
      paused: true,
      onStart: () => setDone(false),
      onComplete: () => setDone(true)
    });
    const update = () => place(state.p);
    // [progresso alvo, duração do trecho, pausa depois]
    const PARADAS = [
      [0.17, 0.9, 0.9],
      [0.42, 1.1, 1.0],
      [0.67, 1.0, 1.0],
      [1, 1.2, 0]
    ];
    PARADAS.forEach(([to, dur, hold]) => {
      tl.to(state, { p: to, duration: dur, ease: 'power1.inOut', onUpdate: update });
      if (hold) tl.to({}, { duration: hold });
    });
    tlRef.current = tl;

    place(0);
    const st = ScrollTrigger.create({
      trigger: pinRef.current,
      start: 'top 65%',
      once: true,
      onEnter: () => tl.play(0)
    });
    ScrollTrigger.refresh();
    return () => {
      st.kill();
      tl.kill();
      tlRef.current = null;
    };
  }, []);

  const replay = () => {
    if (tlRef.current) tlRef.current.play(0);
  };

  return (
    <section className="section hipotese" id="hipotese">
      <div className="container">
        <SectionHead
          kicker="01 · A hipótese"
          title="A Curva de Kuznets Ambiental"
          lead={
            <>
              Popularizada nos anos 1990 a partir dos estudos de Gene Grossman e Alan Krueger, ela adapta a teoria de
              Simon Kuznets (originalmente sobre desigualdade de renda) para o meio ambiente. Aplicada às florestas, ela prevê que a variação da
              floresta desenhe uma curva em <em>U</em> conforme a renda cresce, em quatro estágios.
            </>
          }
        />
      </div>

      <div className="hipotese__pin" ref={pinRef}>
        <div className="container hipotese__grid">
          <div className="hipotese__chart">
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Esquema ilustrativo da Curva de Kuznets Ambiental">
              <defs>
                <linearGradient id="kz-grad" x1="0" x2="1">
                  <stop offset="0%" stopColor="#d9b04f" />
                  <stop offset="30%" stopColor="#ef5b3a" />
                  <stop offset="62%" stopColor="#cfc9a8" />
                  <stop offset="100%" stopColor="#5fd38d" />
                </linearGradient>
                <radialGradient id="kz-glow">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#5fd38d" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* faixas dos estágios */}
              {ESTAGIOS.map((e, i) => (
                <g key={e.letra}>
                  <rect
                    x={sx(i / 4)}
                    y={M.t}
                    width={(W - M.l - M.r) / 4}
                    height={H - M.t - M.b}
                    className={`kz-band ${stage === i ? 'is-on' : ''}`}
                  />
                  <text x={sx(i / 4 + 0.125)} y={H - 24} className={`kz-letter ${stage === i ? 'is-on' : ''}`}>
                    {e.letra}
                  </text>
                </g>
              ))}
              <line x1={M.l} x2={W - M.r} y1={sy(0)} y2={sy(0)} className="kz-zero" />
              <text x={W - M.r} y={sy(0) - 8} className="kz-axis" textAnchor="end">
                perda zero
              </text>
              <text x={M.l - 12} y={sy(0.55)} className="kz-axis kz-axis--pos" textAnchor="end">
                +
              </text>
              <text x={M.l - 12} y={sy(-0.85)} className="kz-axis kz-axis--neg" textAnchor="end">
                −
              </text>
              <text
                transform={`translate(16 ${sy(-0.2)}) rotate(-90)`}
                className="kz-axis"
                textAnchor="middle"
              >
                variação anual da floresta
              </text>
              <text x={M.l} y={H - 2} className="kz-axis">
                renda per capita →
              </text>
              <path d={d} className="kz-ghost" />
              <path ref={trailRef} d={d} className="kz-trail" stroke="url(#kz-grad)" />
              <path ref={pathRef} d={d} fill="none" stroke="none" />
              <g ref={dotRef}>
                <circle r="22" fill="url(#kz-glow)" opacity="0.5" />
                <circle r="7" className="kz-dot" />
              </g>
            </svg>
            {done && !prefersReducedMotion() && (
              <button type="button" className="kz-replay" onClick={replay} aria-label="Repetir a animação da curva">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path
                    d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            <p className="caption">Esquema ilustrativo, sem dados reais. Os dados chegam a seguir.</p>
          </div>

          <div className="hipotese__stages">
            {ESTAGIOS.map((e, i) => (
              <article key={e.letra} className={`stage ${stage === i ? 'is-on' : ''} ${stage > i ? 'is-past' : ''}`}>
                <span className="stage__letter">{e.letra}</span>
                <div>
                  <h3>
                    {e.nome} <small>{e.sub}</small>
                  </h3>
                  <p>{e.texto}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        <AnimatedContent className="callout" distance={50}>
          <p>
            Atenção: a curva <strong>não</strong> afirma que um país rico terá mais floresta que outro em termos absolutos. Ela
            afirma que a <strong>taxa de perda</strong> florestal tende a diminuir, parar e se transformar em regeneração à
            medida que a renda aumenta ao longo do tempo.
          </p>
        </AnimatedContent>
      </div>
    </section>
  );
}
