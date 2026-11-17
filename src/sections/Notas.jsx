import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TRAJ, TRAJ_INFO } from '../lib/data.js';
import Tex from '../components/Tex.jsx';

gsap.registerPlugin(ScrollTrigger);

const METODOLOGIA = [
  {
    t: 'Taxa anual composta',
    d: (
      <>
        <Tex block>{String.raw`r = \left[\left(\frac{F_{2020}}{F_{1990}}\right)^{1/30} - 1\right] \times 100`}</Tex>
        <span>
          Variação média por ano entre 1990 e 2020, em % da própria floresta do país, onde <Tex>{'F'}</Tex> é a área florestal.
        </span>
      </>
    )
  },
  {
    t: 'Trajetória florestal',
    d: (
      <span className="notas__traj">
        {TRAJ.map(k => (
          <span key={k} style={{ '--c': TRAJ_INFO[k].cor }}>
            <i />
            {TRAJ_INFO[k].label} <em>{TRAJ_INFO[k].regra}</em>
          </span>
        ))}
      </span>
    )
  },
  {
    t: 'Faixa de renda',
    d: (
      <span>
        RNB per capita de 2020 (método Atlas), na régua do Banco Mundial: até US$ 1.045 (baixa), até US$ 4.095
        (média-baixa), até US$ 12.695 (média-alta) e acima disso (alta).
      </span>
    )
  },
  {
    t: 'Limpeza da base',
    d: (
      <span>
        De 217 economias, foram retirados os microestados (área &lt; 10.000 km²) e os países sem PIB ou floresta em 1990 e
        2020, restando 151.
      </span>
    )
  },
  {
    t: 'Outliers',
    d: (
      <>
        <Tex block>{String.raw`\begin{aligned} & x < Q_1 - 1{,}5\,\mathrm{AIQ} \\ \text{ou}\ \ & x > Q_3 + 1{,}5\,\mathrm{AIQ} \end{aligned}`}</Tex>
        <span>Critério aplicado no geral e dentro de cada faixa de renda, com AIQ = Q3 − Q1.</span>
      </>
    )
  },
  {
    t: 'Testes e modelos',
    d: (
      <>
        <span>Qui-quadrado de independência e V de Cramér · correlações de Pearson e Spearman · regressões por MQO:</span>
        <Tex block>{String.raw`V = \sqrt{\frac{\chi^2}{n\,(k-1)}}`}</Tex>
        <Tex block>{String.raw`r_i = \beta_0 + \beta_1 \ln(\mathrm{PIB}_i) + \varepsilon_i`}</Tex>
        <Tex block>{String.raw`r_i = \beta_0 + \beta_1 \ln(\mathrm{PIB}_i) + \beta_2 \ln(\mathrm{PIB}_i)^2 + \varepsilon_i`}</Tex>
      </>
    )
  }
];

const FONTES = [
  {
    org: 'Banco Mundial',
    via: 'API oficial (biblioteca wbgapi)',
    itens: [
      ['NY.GDP.PCAP.PP.KD', 'PIB per capita PPC, US$ internacionais constantes de 2021 (1990 e 2020)'],
      ['NY.GNP.PCAP.CD', 'RNB per capita 2020, método Atlas (faixas de renda)'],
      ['SP.POP.TOTL', 'População total (2020)'],
      ['AG.LND.TOTL.K2', 'Área territorial em km² (2020)']
    ],
    link: 'https://data.worldbank.org'
  },
  {
    org: 'Our World in Data / FAO',
    via: 'painel histórico de florestas',
    itens: [
      ['forest-area-km', 'Área florestal em hectares, 1990–2020'],
      ['annual-change-forest-area', 'Taxa líquida de mudança anual'],
      ['forest-transition-phase', 'Fase da transição florestal (Pendrill et al.)']
    ],
    link: 'https://ourworldindata.org/forests-and-deforestation'
  },
  {
    org: 'Our World in Data',
    via: 'seção extra',
    itens: [['deforestation-embedded-trade', 'Desmatamento líquido embutido no comércio; média 2005–2020, > 0 = importador']],
    link: 'https://ourworldindata.org/grapher/deforestation-embedded-trade'
  }
];

const CREDITOS = [
  ['amazonia', 'Floresta Amazônica, vista aérea', 'lubasi', 'CC BY-SA 2.0', 'https://commons.wikimedia.org/wiki/File:Aerial_view_of_the_Amazon_Rainforest.jpg'],
  ['fogo', 'High Park Wildfire', 'U.S. Department of Agriculture', 'Domínio público', 'https://commons.wikimedia.org/wiki/File:Trees_torching_-_High_Park_Wildfire.jpg'],
  [
    'rondonia',
    'Sobrevoo em Rondônia',
    'Bruno Kelly / Amazônia Real',
    'CC BY 2.0',
    'https://commons.wikimedia.org/wiki/File:SOBREVVO_EM_RONDONIA_DIA_07-08-2020_(FOTO_BRUNO_KELLY)_(11)_(50224610152).jpg'
  ],
  [
    'mudas',
    'Mudas para reflorestamento, Tanzânia',
    'USAID Africa Bureau',
    'Domínio público',
    'https://commons.wikimedia.org/wiki/File:Women_with_seedlings_for_reforestation_in_Tanzania_(5984894513).jpg'
  ],
  ['neblina', 'Duke Forest, manhã de neblina', 'Dcrjsr', 'CC BY 3.0', 'https://commons.wikimedia.org/wiki/File:Duke_Forest_misty_morning_h.jpg'],
  ['copa', 'Copa de floresta densa', 'Krishna K. Sahh', 'CC0', 'https://commons.wikimedia.org/wiki/File:Looking_up_into_a_dense_green_forest_canopy.jpg']
];

const SLIDES = ['Metodologia', 'Fonte dos dados', 'Créditos das imagens'];
const N = SLIDES.length;

export default function Notas() {
  const pinRef = useRef(null);
  const viewRef = useRef(null);
  const trackRef = useRef(null);
  const stRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [mode, setMode] = useState('swipe');

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      setMode('pin');
      const tween = gsap.to(trackRef.current, {
        xPercent: (-100 * (N - 1)) / N,
        ease: 'none',
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: `+=${(N - 1) * 110}%`,
          pin: true,
          scrub: 0.7,
          snap: { snapTo: 1 / (N - 1), directional: false, delay: 0.15, duration: { min: 0.25, max: 0.6 }, ease: 'power2.inOut' },
          onUpdate: self => setIdx(Math.round(self.progress * (N - 1)))
        }
      });
      stRef.current = tween.scrollTrigger;
      return () => {
        stRef.current = null;
        setMode('swipe');
      };
    });
    return () => mm.revert();
  }, []);

  // no modo arrastar, a altura acompanha o slide ativo (evita vazio abaixo dos slides curtos)
  useEffect(() => {
    const v = viewRef.current;
    if (!v) return undefined;
    if (mode !== 'swipe') {
      v.style.height = '';
      return undefined;
    }
    const slide = trackRef.current?.children[idx];
    const fit = () => {
      if (slide) v.style.height = `${slide.offsetHeight}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (slide) ro.observe(slide);
    return () => ro.disconnect();
  }, [idx, mode]);

  const onSwipe = () => {
    const v = viewRef.current;
    if (mode === 'swipe' && v) setIdx(Math.round(v.scrollLeft / v.clientWidth));
  };

  const goTo = i => {
    const st = stRef.current;
    if (st) {
      const y = st.start + ((st.end - st.start) * i) / (N - 1);
      if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 });
      else window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      const v = viewRef.current;
      v?.scrollTo({ left: i * v.clientWidth, behavior: 'smooth' });
    }
  };

  return (
    <section className={`notas notas--${mode}`} id="notas" aria-label="Metodologia, fontes e créditos">
      <div className="notas__pin" ref={pinRef}>
        <div className="container notas__head">
          <p className="kicker">Bastidores do estudo</p>
          <div className="notas__tabs" role="tablist">
            {SLIDES.map((s, i) => (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={idx === i}
                className={`notas__tab ${idx === i ? 'is-on' : ''}`}
                onClick={() => goTo(i)}
              >
                <span>{String(i + 1).padStart(2, '0')}</span>
                {s}
              </button>
            ))}
          </div>
          <div className="notas__bar" aria-hidden="true">
            <i style={{ transform: `translateX(${idx * 100}%)`, width: `${100 / N}%` }} />
          </div>
        </div>

        <div className="notas__view" ref={viewRef} onScroll={onSwipe}>
          <div className="notas__track" ref={trackRef} style={{ width: `${N * 100}%` }}>
            {/* 1 · Metodologia */}
            <article className={`notas__slide ${idx === 0 ? 'is-on' : ''}`} style={{ width: `${100 / N}%` }}>
              <div className="container">
                <h3 className="notas__title">Metodologia</h3>
                <div className="notas__grid notas__grid--3">
                  {METODOLOGIA.map(m => (
                    <div key={m.t} className="notas__card">
                      <h4>{m.t}</h4>
                      {m.d}
                    </div>
                  ))}
                </div>
              </div>
            </article>

            {/* 2 · Fontes */}
            <article className={`notas__slide ${idx === 1 ? 'is-on' : ''}`} style={{ width: `${100 / N}%` }}>
              <div className="container">
                <h3 className="notas__title">Fonte dos dados</h3>
                <div className="notas__grid notas__grid--3">
                  {FONTES.map(f => (
                    <div key={f.org + f.via} className="notas__card notas__card--fonte">
                      <span className="notas__via">{f.via}</span>
                      <h4>{f.org}</h4>
                      <ul>
                        {f.itens.map(([code, desc]) => (
                          <li key={code}>
                            <code>{code}</code>
                            <span>{desc}</span>
                          </li>
                        ))}
                      </ul>
                      <a href={f.link} target="_blank" rel="noreferrer" tabIndex={idx === 1 ? 0 : -1}>
                        visitar fonte ↗
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            {/* 3 · Créditos */}
            <article className={`notas__slide ${idx === 2 ? 'is-on' : ''}`} style={{ width: `${100 / N}%` }}>
              <div className="container">
                <h3 className="notas__title">Créditos das imagens</h3>
                <div className="notas__grid notas__grid--3">
                  {CREDITOS.map(([img, t, a, l, u]) => (
                    <a
                      key={img}
                      href={u}
                      target="_blank"
                      rel="noreferrer"
                      className="notas__foto"
                      tabIndex={idx === 2 ? 0 : -1}
                    >
                      <img src={`/img/${img}.webp`} alt="" loading="lazy" />
                      <span className="notas__foto-info">
                        <strong>{t}</strong>
                        <span>
                          {a} · {l}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
                <p className="caption">Todas as fotos vêm do Wikimedia Commons.</p>
              </div>
            </article>
          </div>
        </div>

        <div className={`container notas__hint ${idx === N - 1 ? 'is-hidden' : ''}`} aria-hidden="true">
          {mode === 'pin' ? 'continue rolando →' : 'deslize para o lado →'}
        </div>
      </div>
    </section>
  );
}
