import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FoldText from './reactbits/FoldText.jsx';
import AnimatedContent from './reactbits/AnimatedContent.jsx';
import { prefersReducedMotion } from '../lib/hooks.js';

gsap.registerPlugin(ScrollTrigger);

/* ---------- Tooltip que segue o ponteiro ---------- */
export function useTooltip() {
  const [tip, setTip] = useState(null);
  const show = useCallback((event, content) => {
    const x = event.clientX ?? event.touches?.[0]?.clientX ?? 0;
    const y = event.clientY ?? event.touches?.[0]?.clientY ?? 0;
    setTip({ x, y, content });
  }, []);
  const hide = useCallback(() => setTip(null), []);
  return { tip, show, hide };
}

export function Tooltip({ tip }) {
  if (!tip) return null;
  const left = Math.min(tip.x + 16, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 260);
  return (
    <div className="tooltip" style={{ left: Math.max(8, left), top: tip.y + 16 }} role="status">
      {tip.content}
    </div>
  );
}

/* ---------- Número que conta até o valor ao entrar na tela ---------- */
export function CountUp({ to, decimals = 0, duration = 1.8, prefix = '', suffix = '', className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const format = v =>
      `${prefix}${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(v)}${suffix}`;
    if (prefersReducedMotion()) {
      el.textContent = format(to);
      return undefined;
    }
    const state = { v: 0 };
    el.textContent = format(0);
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () =>
        gsap.to(state, { v: to, duration, ease: 'power3.out', onUpdate: () => (el.textContent = format(state.v)) })
    });
    return () => st.kill();
  }, [to, decimals, duration, prefix, suffix]);
  return <span ref={ref} className={className} />;
}

/* ---------- Cabeçalho de seção: rótulo + título dobrável + lead ---------- */
export function SectionHead({ kicker, title, lead, align = 'left', hinge = 'bottom' }) {
  return (
    <header className={`section-head section-head--${align}`}>
      {kicker && (
        <AnimatedContent distance={24} duration={0.7} className="kicker">
          {kicker}
        </AnimatedContent>
      )}
      <h2 className="section-title">
        <FoldText
          text={title}
          splitBy="word"
          hinge={hinge}
          trigger="scroll"
          fontSize="1em"
          fontWeight={500}
          stagger={0.07}
          duration={0.9}
          hoverRefold
          refoldRadius={160}
          refoldAngle={35}
        />
      </h2>
      {lead && (
        <AnimatedContent distance={40} duration={0.9} delay={0.15} className="lead">
          {lead}
        </AnimatedContent>
      )}
    </header>
  );
}

/* ---------- Barra de progresso de leitura ---------- */
export function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: self => {
        if (ref.current) ref.current.style.transform = `scaleX(${self.progress})`;
      }
    });
    return () => st.kill();
  }, []);
  return <div className="progress" ref={ref} aria-hidden="true" />;
}

/* ---------- Navegação fixa ---------- */
const LINKS = [
  ['hipotese', 'Hipótese'],
  ['dados', 'Dados'],
  ['moda', 'A moda'],
  ['renda', 'Renda'],
  ['virada', 'Ponto de virada'],
  ['casos', 'Casos'],
  ['comercio', 'Comércio'],
  ['conclusoes', 'Conclusões']
];

export function Nav({ lenis }) {
  const [active, setActive] = useState('');
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const triggers = LINKS.map(([id]) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: self => self.isActive && setActive(id)
      })
    );
    const top = ScrollTrigger.create({ start: 80, end: 'max', onToggle: self => setSolid(self.isActive) });
    return () => {
      triggers.forEach(t => t.kill());
      top.kill();
    };
  }, []);
  const go = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (lenis?.current) lenis.current.scrollTo(el, { offset: -10, duration: 1.6 });
    else el?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <nav className={`nav ${solid ? 'nav--solid' : ''}`} aria-label="Seções">
      <a href="#topo" className="nav__brand" onClick={e => go(e, 'topo')}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2 L19 13 H15 L20 20 H4 L9 13 H5 Z" fill="currentColor" />
        </svg>
        <span>Renda &amp; Floresta</span>
      </a>
      <ul className="nav__links">
        {LINKS.map(([id, label]) => (
          <li key={id}>
            <a href={`#${id}`} className={active === id ? 'is-active' : ''} onClick={e => go(e, id)}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------- Imagem de fundo com parallax ---------- */
export function ParallaxImage({ src, alt = '', strength = 18, className = '', overlay = true }) {
  const wrap = useRef(null);
  const img = useRef(null);
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        img.current,
        { yPercent: -strength / 2, scale: 1.15 },
        {
          yPercent: strength / 2,
          scale: 1.15,
          ease: 'none',
          scrollTrigger: { trigger: wrap.current, start: 'top bottom', end: 'bottom top', scrub: true }
        }
      );
    }, wrap);
    return () => ctx.revert();
  }, [strength]);
  return (
    <div ref={wrap} className={`parallax ${className}`}>
      <img ref={img} src={src} alt={alt} loading="lazy" decoding="async" />
      {overlay && <div className="parallax__veil" />}
    </div>
  );
}
