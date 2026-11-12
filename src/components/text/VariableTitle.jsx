import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../lib/hooks.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Título com revelação letra a letra + "Variable Proximity" (inspirado no React Bits):
 * as letras próximas ao cursor ganham peso, suavidade e o "wonk" da Fraunces variável.
 */
export default function VariableTitle({
  text,
  as: Tag = 'h1',
  className = '',
  trigger = 'mount',
  delay = 0,
  radius = 230,
  weight = [320, 880],
  soft = [0, 100]
}) {
  const root = useRef(null);
  const lines = text.split('\n');

  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    const chars = Array.from(el.querySelectorAll('.vt__char'));
    const reduce = prefersReducedMotion();
    const cur = chars.map(() => 0);

    const paint = (c, t) => {
      const w = weight[0] + (weight[1] - weight[0]) * t;
      const s = soft[0] + (soft[1] - soft[0]) * t;
      c.style.fontVariationSettings = `'wght' ${w.toFixed(0)}, 'opsz' 144, 'SOFT' ${s.toFixed(0)}, 'WONK' ${t > 0.45 ? 1 : 0}`;
    };
    chars.forEach(c => paint(c, 0));

    let tween = null;
    let st = null;
    if (!reduce) {
      gsap.set(chars, { yPercent: 110, opacity: 0, rotate: 8, filter: 'blur(12px)' });
      const play = () => {
        tween = gsap.to(chars, {
          yPercent: 0,
          opacity: 1,
          rotate: 0,
          filter: 'blur(0px)',
          duration: 1.3,
          ease: 'expo.out',
          stagger: 0.028,
          delay,
          onComplete: () => gsap.set(chars, { clearProps: 'filter' })
        });
      };
      if (trigger === 'mount') play();
      else st = ScrollTrigger.create({ trigger: el, start: 'top 82%', once: true, onEnter: play });
    }

    const fine = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
    if (reduce || !fine) {
      return () => {
        tween?.kill();
        st?.kill();
      };
    }

    let mouse = null;
    let raf = 0;
    const frame = () => {
      raf = 0;
      let moving = false;
      chars.forEach((c, i) => {
        let target = 0;
        if (mouse) {
          const r = c.getBoundingClientRect();
          const d = Math.hypot(r.left + r.width / 2 - mouse.x, r.top + r.height / 2 - mouse.y) / radius;
          if (d < 1) target = 1 - d * d * (3 - 2 * d);
        }
        cur[i] += (target - cur[i]) * 0.16;
        if (Math.abs(target - cur[i]) > 0.003) moving = true;
        else cur[i] = target;
        paint(c, cur[i]);
      });
      if (moving) raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onMove = e => {
      mouse = { x: e.clientX, y: e.clientY };
      wake();
    };
    const onLeave = () => {
      mouse = null;
      wake();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('scroll', wake, { passive: true });

    return () => {
      tween?.kill();
      st?.kill();
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', wake);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, trigger, delay, radius]);

  return (
    <Tag ref={root} className={`vt ${className}`.trim()} aria-label={text.replace(/\n/g, ' ')}>
      {lines.map((line, li) => (
        <span className="vt__line" key={li} aria-hidden="true">
          {line.split(' ').map((word, wi, arr) => (
            <span key={wi}>
              <span className="vt__word">
                {Array.from(word).map((ch, ci) => (
                  <span className="vt__char" key={ci}>
                    {ch}
                  </span>
                ))}
              </span>
              {wi < arr.length - 1 ? ' ' : null}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
