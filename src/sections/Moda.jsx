import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHead } from '../components/ui.jsx';
import AnimatedContent from '../components/reactbits/AnimatedContent.jsx';
import { STATS, TRAJ, TRAJ_INFO } from '../lib/data.js';
import { pct } from '../lib/format.js';
import { useInView } from '../lib/hooks.js';

const MAX = 62;

export default function Moda() {
  const [viewRef, seen] = useInView(0.35);
  const [merged, setMerged] = useState(false);
  const touched = useRef(false);
  const autoRef = useRef(null);

  // junta as perdas automaticamente quando o leitor rola até o meio do gráfico (uma vez)
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: autoRef.current,
      start: 'top 45%',
      once: true,
      onEnter: () => {
        if (!touched.current) setTimeout(() => !touched.current && setMerged(true), 900);
      }
    });
    return () => st.kill();
  }, []);

  const toggle = () => {
    touched.current = true;
    setMerged(m => !m);
  };

  const h = n => `${(n / MAX) * 100}%`;
  const acel = STATS.trajetoria[TRAJ[0]].n;

  return (
    <section className="section moda" id="moda">
      <div className="container">
        <SectionHead
          kicker="04 · A primeira armadilha"
          title="A moda diz “ganho florestal”"
          lead="Quando os países são classificados em quatro trajetórias, a categoria mais comum é o Ganho florestal. Parece uma boa notícia, mas o resultado depende de como as categorias foram montadas."
        />

        <div className="moda__layout" ref={viewRef}>
          <div className="moda__chart" ref={autoRef}>
            <div className="moda__plot" role="img" aria-label="Número de países por trajetória florestal">
              <div className="moda__ref" style={{ bottom: h(52) }}>
                <span>moda · 52</span>
              </div>
              {TRAJ.map((t, i) => {
                const info = TRAJ_INFO[t];
                const n = STATS.trajetoria[t].n;
                const isMod = i === 1;
                const style = {
                  height: seen ? h(n) : 0,
                  background: info.cor,
                  transitionDelay: seen && !merged ? `${i * 0.1}s` : '0s'
                };
                if (isMod && merged) {
                  style.transform = `translate(calc(-100% - var(--gap)), calc(-1 * var(--plot-h) * ${acel / MAX}))`;
                }
                return (
                  <div key={t} className="moda__col">
                    <div className={`moda__bar ${isMod && merged ? 'is-stacked' : ''}`} style={style}>
                      <span className="moda__n">{n}</span>
                    </div>
                  </div>
                );
              })}
              <div className={`moda__total ${merged ? 'is-on' : ''}`} style={{ bottom: h(59) }}>
                <strong>59</strong>
                <span>países perderam floresta</span>
              </div>
            </div>
            <div className="moda__labels">
              {TRAJ.map(t => (
                <div key={t}>
                  <strong>{TRAJ_INFO[t].label}</strong>
                  <span>{TRAJ_INFO[t].regra}</span>
                </div>
              ))}
            </div>
            <button type="button" className={`btn ${merged ? 'btn--ghost' : ''}`} onClick={toggle} aria-pressed={merged}>
              {merged ? 'Separar as perdas de novo' : 'Somar as duas categorias de perda'}
            </button>
          </div>

          <div className="moda__text">
            <AnimatedContent distance={40} className="moda__step">
              <span className="tag">o que a tabela mostra</span>
              <p>
                <strong className="leaf">Ganho florestal</strong> é a moda, com <strong>52 países</strong> (
                {pct(34.4)}). Em seguida vêm Estável (40), Perda acelerada (30) e Perda moderada (29).
              </p>
            </AnimatedContent>
            <AnimatedContent distance={40} delay={0.1} className="moda__step">
              <span className="tag tag--fire">o detalhe</span>
              <p>
                A perda foi dividida em <strong>duas</strong> categorias (acelerada e moderada), enquanto o ganho ficou em uma
                só. A moda depende de como os intervalos foram cortados.
              </p>
            </AnimatedContent>
            <AnimatedContent distance={40} delay={0.2} className="moda__step">
              <span className="tag tag--fire">quando se soma</span>
              <p>
                <strong className="fire">30 + 29 = 59 países</strong> ({pct(STATS.perdaTotal.pct)}) tiveram desmatamento
                líquido expressivo. São <strong>mais países perdendo</strong> do que ganhando floresta.
              </p>
            </AnimatedContent>
            <AnimatedContent distance={40} delay={0.3} className="moda__step">
              <span className="tag">a confirmação</span>
              <p>
                A mediana da taxa anual, vista na seção anterior, também é levemente negativa: mais da metade dos países
                perdeu cobertura florestal ao longo das três décadas, ainda que muitos por muito pouco.
              </p>
            </AnimatedContent>
          </div>
        </div>
      </div>
    </section>
  );
}
