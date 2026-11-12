const CREDITOS = [
  ['Floresta Amazônica, vista aérea', 'lubasi', 'CC BY-SA 2.0', 'https://commons.wikimedia.org/wiki/File:Aerial_view_of_the_Amazon_Rainforest.jpg'],
  ['High Park Wildfire', 'U.S. Department of Agriculture', 'Domínio público', 'https://commons.wikimedia.org/wiki/File:Trees_torching_-_High_Park_Wildfire.jpg'],
  [
    'Sobrevoo em Rondônia (foto: Bruno Kelly)',
    'Amazônia Real',
    'CC BY 2.0',
    'https://commons.wikimedia.org/wiki/File:SOBREVVO_EM_RONDONIA_DIA_07-08-2020_(FOTO_BRUNO_KELLY)_(11)_(50224610152).jpg'
  ],
  [
    'Mudas para reflorestamento na Tanzânia',
    'USAID Africa Bureau',
    'Domínio público',
    'https://commons.wikimedia.org/wiki/File:Women_with_seedlings_for_reforestation_in_Tanzania_(5984894513).jpg'
  ],
  ['Duke Forest misty morning', 'Dcrjsr', 'CC BY 3.0', 'https://commons.wikimedia.org/wiki/File:Duke_Forest_misty_morning_h.jpg'],
  ['Dense green forest canopy', 'Krishna K. Sahh', 'CC0', 'https://commons.wikimedia.org/wiki/File:Looking_up_into_a_dense_green_forest_canopy.jpg']
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <p className="footer__brand">Renda &amp; Floresta</p>
          <p>
            Trabalho A2 · Métodos Estatísticos Aplicados às Ciências Sociais. Todos os números e gráficos deste site foram
            gerados a partir da análise do notebook <em>A2_MÉTODOS_ESTATÍSTICOS.ipynb</em>.
          </p>
        </div>
        <div>
          <h4>Fontes dos dados</h4>
          <ul>
            <li>Banco Mundial: PIB per capita PPC (NY.GDP.PCAP.PP.KD), população, área territorial, RNB per capita e classificações.</li>
            <li>Our World in Data / FAO: área florestal, mudança anual e fase da transição florestal (Pendrill et al.).</li>
            <li>Our World in Data: desmatamento embutido no comércio internacional.</li>
          </ul>
        </div>
        <div>
          <h4>Metodologia</h4>
          <ul>
            <li>Taxa anual composta: ((floresta 2020 / floresta 1990)^(1/30) − 1) × 100.</li>
            <li>Outliers pelo critério de 1,5 × AIQ.</li>
            <li>Qui-quadrado de independência, V de Cramér, Pearson, Spearman e regressões por MQO.</li>
          </ul>
        </div>
        <div>
          <h4>Créditos das imagens (Wikimedia Commons)</h4>
          <ul className="footer__credits">
            {CREDITOS.map(([t, a, l, u]) => (
              <li key={u}>
                <a href={u} target="_blank" rel="noreferrer">
                  {t}
                </a>{' '}
                · {a} · {l}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
