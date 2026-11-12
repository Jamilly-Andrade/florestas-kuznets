import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../lib/hooks.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * "Scroll Float" (inspirado no React Bits): as letras sobem esticadas e se assentam
 * conforme a rolagem, presas ao scroll (scrub).
 */
export default function ScrollFloat({ text, className = '' }) {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return undefined;
    const chars = el.querySelectorAll('.sf__char');
    const tween = gsap.fromTo(
      chars,
      { opacity: 0, yPercent: 120, scaleY: 2.3, scaleX: 0.7, transformOrigin: '50% 0%' },
      {
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        ease: 'back.inOut(2)',
        stagger: 0.03,
        scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 45%', scrub: 0.6 }
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [text]);

  const words = text.split(' ');
  return (
    <span ref={root} className={`sf ${className}`.trim()} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden="true">
          <span className="sf__word">
            {Array.from(word).map((ch, ci) => (
              <span className="sf__char" key={ci}>
                {ch}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  );
}
