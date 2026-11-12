import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import VariableTitle from '../components/text/VariableTitle.jsx';
import AnimatedContent from '../components/reactbits/AnimatedContent.jsx';
import { paises } from '../lib/data.js';
import { prefersReducedMotion } from '../lib/hooks.js';

const nomes = paises.map(p => p.nome);

export default function Hero() {
  const root = useRef(null);
  const bg = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(bg.current, { scale: 1.25, filter: 'brightness(0.2)' }, { scale: 1.08, filter: 'brightness(1)', duration: 2.6, ease: 'power2.out' });
      gsap.to(bg.current, {
        yPercent: 18,
        scale: 1.2,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.to('.hero__inner', {
        yPercent: -30,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="topo" ref={root}>
      <div className="hero__bg">
        <img ref={bg} src="/img/amazonia.webp" alt="Vista aérea da Floresta Amazônica cortada por um rio" />
      </div>
      <div className="hero__veil" />

      <div className="hero__inner">
        <AnimatedContent trigger="mount" delay={0.4} distance={20} className="hero__kicker">
          <span className="dot" /> Curva de Kuznets Ambiental · Transição Florestal
        </AnimatedContent>

        <VariableTitle text={'Países mais ricos\nperdem menos\nfloresta?'} className="hero__title" delay={0.3} />

        <AnimatedContent trigger="mount" delay={1.2} distance={30} blur={8} className="hero__sub">
          E existe um ponto da renda a partir do qual a destruição <em>para</em> e se reverte em{' '}
          <em className="leaf">reflorestamento</em>?
        </AnimatedContent>

        <AnimatedContent trigger="mount" delay={1.6} distance={20} className="hero__meta">
          <div>
            <strong>151</strong>
            <span>países</span>
          </div>
          <div>
            <strong>30</strong>
            <span>anos de dados</span>
          </div>
          <div>
            <strong>1990—2020</strong>
            <span>Banco Mundial · FAO / OWID</span>
          </div>
        </AnimatedContent>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span>role para descobrir</span>
        <i />
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].map(k => (
            <span key={k}>
              {nomes.map(n => (
                <span key={n + k} className="marquee__item">
                  {n}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
