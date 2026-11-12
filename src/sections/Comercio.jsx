import { useState } from 'react';
import { SectionHead, CountUp, ParallaxImage, Tooltip, useTooltip } from '../components/ui.jsx';
import AnimatedContent from '../components/reactbits/AnimatedContent.jsx';
import { paises, RENDAS, STATS } from '../lib/data.js';
import { pct } from '../lib/format.js';
import { useInView } from '../lib/hooks.js';

export default function Comercio() {
  const [ref, seen] = useInView(0.35);
  const { tip, show, hide } = useTooltip();
  const [faixa, setFaixa] = useState('Alta renda');
  const lista = paises.filter(p => p.renda === faixa && p.comercio);
  const exp = lista.filter(p => p.comercio.startsWith('Exp'));
  const imp = lista.filter(p => p.comercio.startsWith('Imp'));

  return (
    <section className="section comercio" id="comercio">
      <ParallaxImage src="/img/neblina.webp" alt="Floresta com troncos finos sob neblina" className="comercio__bg" />
      <div className="container comercio__inner">
        <SectionHead
          kicker="09 · Seção extra"
          title="A floresta que os ricos importam"
          lead="Uma das principais críticas à Transição Florestal: e se o reflorestamento dos países ricos fosse acompanhado da importação de desmatamento embutido em carne, soja, madeira e outros produtos vindos de países mais pobres?"
        />

        <div className="comercio__hero">
          <AnimatedContent className="comercio__num" distance={0} scale={0.7} blur={16} duration={1.3}>
            <CountUp to={93} suffix="%" duration={2.2} />
          </AnimatedContent>
          <AnimatedContent className="comercio__claim" distance={40} delay={0.2}>
            dos países de <strong>alta renda</strong> são <strong>importadores líquidos de desmatamento</strong>: consomem
            produtos cuja pegada de destruição florestal ocorreu fora de suas fronteiras.
          </AnimatedContent>
        </div>

        <div className="stack stack--trade" ref={ref}>
          <div className="legend">
            <span className="legend__item">
              <i style={{ background: 'var(--fire)' }} />
              Exportador líquido (o desmatamento acontece ali)
            </span>
            <span className="legend__item">
              <i style={{ background: 'var(--sky)' }} />
              Importador líquido (terceiriza o desmatamento)
            </span>
          </div>
          {RENDAS.map((r, ri) => {
            const c = STATS.comercio[r];
            return (
              <button
                type="button"
                key={r}
                className={`stack__row stack__row--btn ${faixa === r ? 'is-on' : ''}`}
                onClick={() => setFaixa(r)}
                aria-pressed={faixa === r}
              >
                <div className="stack__label">
                  <strong>{r}</strong>
                  <span>clique para ver os países</span>
                </div>
                <div className="stack__bar">
                  {[
                    ['exp', c.exp, 'var(--fire)', 'Exportadores líquidos'],
                    ['imp', c.imp, 'var(--sky)', 'Importadores líquidos']
                  ].map(([k, v, cor, label], i) => (
                    <div
                      key={k}
                      className="stack__seg"
                      style={{ width: seen ? `${v}%` : 0, background: cor, transitionDelay: `${ri * 0.15 + i * 0.1}s` }}
                      onPointerMove={e =>
                        show(
                          e,
                          <>
                            <strong>{r}</strong>
                            <span>
                              {label}: {pct(v)}
                            </span>
                          </>
                        )
                      }
                      onPointerLeave={hide}
                    >
                      <span>{pct(v, 1)}</span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
          <Tooltip tip={tip} />
        </div>

        <div className="trade-lists" aria-live="polite">
          <div>
            <h4 className="fire">
              Exportadores · {faixa} ({exp.length})
            </h4>
            <div className="chips">
              {exp.map(p => (
                <span key={p.iso} className="chip chip--fire">
                  {p.nome}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="sky">
              Importadores · {faixa} ({imp.length})
            </h4>
            <div className="chips">
              {imp.map(p => (
                <span key={p.iso} className="chip chip--sky">
                  {p.nome}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="prose prose--cols">
          <AnimatedContent distance={40}>
            <p>
              Nas faixas de Baixa renda e Renda média-baixa, quase metade dos países (cerca de 48% a 49%) atua como{' '}
              <strong className="fire">exportadora líquida</strong>, arcando com o custo físico do desmatamento em seus solos
              para abastecer o mercado internacional.
            </p>
          </AnimatedContent>
          <AnimatedContent distance={40} delay={0.1}>
            <p>
              A recuperação florestal das nações ricas não decorre só de consciência ecológica ou de leis mais rígidas, mas
              também de uma <strong>terceirização ambiental</strong>: preservam suas paisagens enquanto demandam commodities
              produzidas com a conversão de florestas tropicais na América Latina, na África e no Sudeste Asiático.
            </p>
          </AnimatedContent>
        </div>

        <AnimatedContent className="verdict verdict--sky" distance={40} blur={6}>
          <p className="verdict__k">o limite da curva</p>
          <p className="verdict__v">
            A transição florestal parece real quando olhamos para dentro de cada fronteira, mas é viabilizada, em grande medida,
            pela <span className="sky">transferência geográfica</span> do impacto ecológico.
          </p>
        </AnimatedContent>
        <p className="caption">
          Média do desmatamento líquido embutido no comércio entre 2005 e 2020 · {STATS.totalComercio} países com dados.
        </p>
      </div>
    </section>
  );
}
