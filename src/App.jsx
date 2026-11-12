import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Nav, ScrollProgress } from './components/ui.jsx';
import { prefersReducedMotion } from './lib/hooks.js';
import Hero from './sections/Hero.jsx';
import Hipotese from './sections/Hipotese.jsx';
import Dados from './sections/Dados.jsx';
import Equilibrio from './sections/Equilibrio.jsx';
import Moda from './sections/Moda.jsx';
import Destruicao from './sections/Destruicao.jsx';
import Renda from './sections/Renda.jsx';
import Virada from './sections/Virada.jsx';
import Casos from './sections/Casos.jsx';
import Comercio from './sections/Comercio.jsx';
import Conclusoes from './sections/Conclusoes.jsx';
import Notas from './sections/Notas.jsx';
import Footer from './sections/Footer.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const lenis = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const instance = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    lenis.current = instance;
    window.__lenis = instance;
    instance.on('scroll', ScrollTrigger.update);
    const tick = time => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // recalcula posições quando fontes/imagens terminarem de carregar
    const refresh = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('load', refresh);
      instance.destroy();
      lenis.current = null;
      window.__lenis = null;
    };
  }, []);

  return (
    <>
      <ScrollProgress />
      <Nav lenis={lenis} />
      <div className="grain" aria-hidden="true" />
      <main>
        <Hero />
        <Hipotese />
        <Dados />
        <Equilibrio />
        <Moda />
        <Destruicao />
        <Renda />
        <Virada />
        <Casos />
        <Comercio />
        <Conclusoes />
        <Notas />
      </main>
      <Footer />
    </>
  );
}
