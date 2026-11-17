import { useState } from 'react';
import MaskedHeading from '../components/reactbits/MaskedHeading.jsx';
import AnimatedContent from '../components/reactbits/AnimatedContent.jsx';
import { ParallaxImage } from '../components/ui.jsx';
import { paises, STATS } from '../lib/data.js';
import { ha, pct, signed } from '../lib/format.js';

const OUTLIERS = paises
  .filter(p => p.taxa < STATS.taxa.limInf)
  .sort((a, b) => a.taxa - b.taxa);

const REGIAO_CURTA = {
  'África Subsaariana': 'África Subsaariana',
  'América Latina e Caribe': 'América Latina'
};

function Tree({ burned, i }) {
  return (
    <svg viewBox="0 0 20 26" className={`tree ${burned ? 'is-burned' : ''}`} style={{ '--i': i }} aria-hidden="true">
      <path d="M10 1 L17 11 H13.5 L18.5 19 H1.5 L6.5 11 H3 Z" className="tree__crown" />
      <rect x="8.6" y="19" width="2.8" height="6" className="tree__trunk" />
    </svg>
  );
}

export default function Destruicao() {
  const [iso, setIso] = useState(OUTLIERS[0].iso);
  const pais = OUTLIERS.find(p => p.iso === iso);
  const perdidas = Math.round(-pais.varTotal);

  return (
    <section className="section destruicao" id="destruicao">
      <div className="destruicao__mask">
        <div className="container container--wide">
          <p className="kicker kicker--fire">05 · A ponta negativa</p>
          <MaskedHeading
            text="DESMATAMENTO"
            tag="h2"
            src="/img/fogo.webp"
            fillScale={1.35}
            parallax={34}
            drift={22}
            hoverZoom={0.08}
            brightness={1.45}
            saturation={1.25}
            spotlight
            spotlightRadius={190}
            outline
            outlineColor="rgba(255, 140, 80, 0.55)"
            outlineWidth={1.2}
            reveal="rise"
            duration={1.4}
            stagger={0.05}
            weight={800}
            tracking={-0.045}
            textScale={0.112}
            className="destruicao__heading"
            aria-label="Desmatamento"
          />
          <AnimatedContent className="destruicao__intro" distance={40}>
            Os dez outliers de perda, abaixo de <strong>−1,20% ao ano</strong>, são quase todos de baixa renda ou renda
            média-baixa e ficam na África Subsaariana. Fora da África aparecem Nicarágua e Paraguai. Em comum, a expansão de
            pastagens e lavouras impulsiona o desmatamento acelerado.
          </AnimatedContent>
        </div>
      </div>

      <div className="destruicao__body">
        <ParallaxImage src="/img/rondonia.webp" alt="Floresta sendo queimada em Rondônia, vista aérea" className="destruicao__bg" />
        <div className="container destruicao__grid">
          <div className="outlier-list" role="listbox" aria-label="Países com perda florestal extrema">
            {OUTLIERS.map((p, i) => (
              <button
                type="button"
                role="option"
                aria-selected={p.iso === iso}
                key={p.iso}
                className={`outlier ${p.iso === iso ? 'is-on' : ''}`}
                onPointerEnter={() => setIso(p.iso)}
                onFocus={() => setIso(p.iso)}
                onClick={() => setIso(p.iso)}
              >
                <span className="outlier__rank">{String(i + 1).padStart(2, '0')}</span>
                <span className="outlier__name">{p.nome}</span>
                <span className="outlier__bar">
                  <i style={{ width: `${(-p.varTotal / 55) * 100}%` }} />
                </span>
                <span className="outlier__val">{pct(p.varTotal, 1)}</span>
              </button>
            ))}
          </div>

          <div className="forest-card" aria-live="polite">
            <div className="forest-card__head">
              <h3>{pais.nome}</h3>
              <p>
                {pais.renda} · {REGIAO_CURTA[pais.regiao] ?? pais.regiao}
              </p>
            </div>
            <div className="forest" role="img" aria-label={`${perdidas} de cada 100 árvores perdidas entre 1990 e 2020`}>
              {Array.from({ length: 100 }, (_, i) => (
                <Tree key={i} i={i} burned={i < perdidas} />
              ))}
            </div>
            <div className="forest-card__stats">
              <div>
                <span>de cada 100 árvores de 1990</span>
                <strong className="fire">{perdidas} perdidas</strong>
              </div>
              <div>
                <span>taxa anual</span>
                <strong>{signed(pais.taxa, 2)}% a.a.</strong>
              </div>
              <div>
                <span>floresta 1990 → 2020</span>
                <strong>
                  {ha(pais.flo1990)} → {ha(pais.flo2020)}
                </strong>
              </div>
            </div>
            {pais.iso === 'BFA' && (
              <p className="forest-card__note">
                O caso mais drástico: em 30 anos, Burquina Faso perdeu <strong>mais da metade</strong> de toda a sua cobertura
                florestal.
              </p>
            )}
            {pais.iso === 'PRY' && (
              <p className="forest-card__note">
                O único país de renda média-alta entre os outliers de perda. Ele volta a aparecer mais adiante.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
