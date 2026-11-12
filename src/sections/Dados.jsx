import { SectionHead, CountUp } from '../components/ui.jsx';
import AnimatedContent from '../components/reactbits/AnimatedContent.jsx';
import { RENDAS, RENDA_COR, STATS } from '../lib/data.js';
import { num, pct } from '../lib/format.js';
import { useInView } from '../lib/hooks.js';

const PERGUNTAS = [
  'Países com maior renda per capita apresentam menor taxa de perda florestal e maior tendência de reflorestamento em relação à sua própria área de floresta?',
  'Existe um ponto de inflexão estatisticamente identificável em que a taxa média de variação da floresta passa de negativa (desmatamento líquido) para positiva (expansão florestal líquida)?',
  'Ao acompanhar as trajetórias individuais ao longo de 30 anos, quais nações seguiram o padrão em U e quais permanecem em desmatamento acelerado apesar do crescimento econômico?',
  'O reflorestamento dos países de alta renda é acompanhado pela importação de desmatamento embutido em produtos agropecuários vindos de países de menor renda?'
];

const FONTES = [
  {
    nome: 'Banco Mundial',
    via: 'API oficial · wbgapi',
    itens: [
      'PIB per capita PPC (US$ constantes de 2021)',
      'População total',
      'Área territorial (km²)',
      'Região e faixa de renda (RNB per capita 2020, método Atlas)'
    ]
  },
  {
    nome: 'Our World in Data / FAO',
    via: 'painel 1990–2020',
    itens: [
      'Área florestal em hectares',
      'Taxa líquida de mudança anual',
      'Fase da transição florestal (Pendrill et al.)'
    ]
  },
  {
    nome: 'Seção extra · OWID',
    via: 'comércio internacional',
    itens: ['Desmatamento líquido embutido no comércio (importado vs. exportado), média 2005–2020']
  }
];

export default function Dados() {
  const [barRef, seen] = useInView(0.4);
  return (
    <section className="section dados" id="dados">
      <div className="container">
        <SectionHead
          kicker="02 · O estudo"
          title="Quatro perguntas, três décadas"
          lead="A investigação testa se a Curva de Kuznets Ambiental e a Transição Florestal se sustentam nos dados globais observados entre 1990 e 2020."
        />

        <ol className="perguntas">
          {PERGUNTAS.map((p, i) => (
            <li key={i}>
              <AnimatedContent distance={60} delay={i * 0.08} className="pergunta">
                <span className="pergunta__n">0{i + 1}</span>
                <p>{p}</p>
              </AnimatedContent>
            </li>
          ))}
        </ol>

        <div className="funil">
          <AnimatedContent className="funil__step" distance={40}>
            <CountUp to={STATS.totalInicial} className="big" />
            <span>economias no cruzamento inicial das bases</span>
          </AnimatedContent>
          <AnimatedContent className="funil__arrow" distance={20} delay={0.2}>
            <span>− microestados (&lt; 10.000 km²)</span>
            <span>− países sem PIB ou floresta em 1990 e 2020</span>
          </AnimatedContent>
          <AnimatedContent className="funil__step funil__step--final" distance={40} delay={0.3}>
            <CountUp to={STATS.total} className="big leaf" />
            <span>países na base final</span>
          </AnimatedContent>
        </div>

        <div className="fontes">
          {FONTES.map((f, i) => (
            <AnimatedContent key={f.nome} className="fonte" distance={50} delay={i * 0.1} tilt={8}>
              <span className="fonte__via">{f.via}</span>
              <h3>{f.nome}</h3>
              <ul>
                {f.itens.map(it => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </AnimatedContent>
          ))}
        </div>

        <div className="amostra" ref={barRef}>
          <h3 className="mini-title">Quem está na amostra</h3>
          <div className="amostra__bar" role="img" aria-label="Distribuição dos 151 países por faixa de renda">
            {RENDAS.map((r, i) => (
              <div
                key={r}
                className="amostra__seg"
                style={{
                  flexGrow: seen ? STATS.renda[r].n : 0.0001,
                  background: RENDA_COR[r],
                  transitionDelay: `${i * 0.12}s`
                }}
              >
                <strong>{STATS.renda[r].n}</strong>
                <span>{r}</span>
              </div>
            ))}
          </div>
          <p className="caption">
            Moda: <strong>Renda média-baixa</strong> ({num(45)} países, {pct(29.8)}). A base cobre todos os estágios de
            riqueza, com leve predomínio de nações em desenvolvimento intermediário.
          </p>
          <div className="regioes">
            {STATS.regiao.map(([nome, n, p]) => (
              <div key={nome} className="regiao">
                <span className="regiao__n">{n}</span>
                <span className="regiao__nome">{nome}</span>
                <span className="regiao__bar" style={{ width: seen ? `${(n / 45) * 100}%` : 0 }} />
                <span className="regiao__p">{pct(p)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
