import { SectionHead, ParallaxImage } from '../components/ui.jsx';
import AnimatedContent from '../components/reactbits/AnimatedContent.jsx';
import VariableTitle from '../components/text/VariableTitle.jsx';

const CONCLUSOES = [
  {
    n: '01',
    titulo: 'Sim, países mais ricos perdem menos floresta',
    destaque: 'r = 0,42 · ρ = 0,54',
    texto:
      'A correlação entre PIB per capita e taxa anual de variação florestal é positiva e significativa. Baixa renda: −0,74% ao ano em média. Alta renda: +0,41% ao ano, sem nenhuma nação rica em perda acelerada e mais da metade com ganho florestal.'
  },
  {
    n: '02',
    titulo: 'Existe um ponto estatístico de reversão',
    destaque: '≈ US$ 15.260 – 15.500',
    texto:
      'Por volta desse patamar de PIB per capita (PPC), a taxa estimada cruza a linha de perda zero e entra no campo do reflorestamento, um valor próximo do PIB per capita típico dos países de Renda média-alta (mediana de cerca de US$ 16.900 em PPC), justamente a faixa em que perdas e ganhos se equilibram (mediana de 0,00% ao ano).'
  },
  {
    n: '03',
    titulo: 'A reta explica tanto quanto a curva',
    destaque: 'R² 0,243 vs 0,244',
    texto:
      'O termo quadrático não é significativo (p = 0,914). O modelo linear simples é o preferível, pois explica praticamente o mesmo fenômeno sem termos desnecessários.'
  },
  {
    n: '04',
    titulo: 'A transição não é automática',
    destaque: 'Vietnã, Costa Rica, China × Brasil, Paraguai',
    texto:
      'Políticas públicas ativas, incentivos e governança ambiental permitiram expandir florestas antes de altos níveis de riqueza. Já economias dependentes da exportação de carne e soja podem seguir presas na destruição mesmo após cruzar o patamar de renda esperado.'
  },
  {
    n: '05',
    titulo: 'O sucesso dos ricos é parcialmente terceirizado',
    destaque: '93% importam desmatamento',
    texto:
      'Quase todos os países ricos são importadores líquidos de desmatamento. Parte do ganho florestal dentro das suas fronteiras depende de perdas que acontecem em outros países.'
  }
];

const LIMITACOES = [
  'A base da FAO soma florestas naturalmente regeneradas (nativas primárias e secundárias) e florestas plantadas (silvicultura comercial), que têm valores ecológicos e níveis de biodiversidade muito diferentes.',
  'A disponibilidade de séries confiáveis de PIB per capita em PPC com cobertura global limitou a janela a três décadas (1990–2020), o que impede acompanhar transições de prazo mais longo.',
  'Por ser um modelo estatístico geral, a análise não incorpora variáveis institucionais como estabilidade política, corrupção, demarcação de terras indígenas e preços internacionais de commodities.'
];

export default function Conclusoes() {
  return (
    <section className="section conclusoes" id="conclusoes">
      <div className="conclusoes__banner">
        <ParallaxImage src="/img/copa.webp" alt="Copa densa de árvores vista de baixo" strength={26} />
        <div className="container conclusoes__banner-inner">
          <p className="kicker">10 · Conclusões do estudo</p>
          <VariableTitle
            as="h2"
            text={'O que três décadas\nde dados nos dizem'}
            className="conclusoes__title"
            trigger="scroll"
          />
        </div>
      </div>

      <div className="container">
        <div className="conclusoes__list">
          {CONCLUSOES.map((c, i) => (
            <AnimatedContent key={c.n} className="conclusao" distance={70} delay={0.05} tilt={10} wipe="up" duration={1}>
              <span className="conclusao__n">{c.n}</span>
              <div className="conclusao__body">
                <h3>{c.titulo}</h3>
                <p className="conclusao__destaque">{c.destaque}</p>
                <p>{c.texto}</p>
              </div>
              <span className="conclusao__line" style={{ '--i': i }} />
            </AnimatedContent>
          ))}
        </div>

        <SectionHead kicker="Limitações do trabalho" title="O que os dados não mostram" />
        <div className="limitacoes">
          {LIMITACOES.map((l, i) => (
            <AnimatedContent key={i} className="limitacao" distance={40} delay={i * 0.1}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <p>{l}</p>
            </AnimatedContent>
          ))}
        </div>

        <AnimatedContent className="final" distance={50} blur={10} duration={1.2}>
          <p>
            Enriquecer <span className="leaf">ajuda</span> a floresta a voltar.
            <br />
            Mas a floresta que volta em um lugar pode estar caindo em <span className="fire">outro</span>.
          </p>
        </AnimatedContent>
      </div>
    </section>
  );
}
