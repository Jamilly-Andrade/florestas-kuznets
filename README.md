# Renda & Floresta

Site interativo, em formato de storytelling, do trabalho A2 de **Métodos Estatísticos Aplicados às Ciências Sociais**:
_Países mais ricos perdem menos floresta? Existe um ponto da renda a partir do qual a destruição para e se reverte em reflorestamento?_

Todos os números e gráficos vêm do notebook `A2_MÉTODOS_ESTATÍSTICOS.ipynb` (151 países, 1990–2020).

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera a pasta dist/
```

## Publicar no Vercel

1. Suba este repositório para o GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. O Vercel detecta o Vite sozinho (build: `npm run build`, saída: `dist`). Clique em **Deploy**.

## Estrutura

- `src/data/*.json`: dados extraídos das saídas do notebook (países, curva ajustada, séries temporais).
- `src/lib/data.js`: estatísticas reportadas no notebook (qui-quadrado, regressões, correlações etc.).
- `src/sections/`: cada capítulo da narrativa.
- `src/components/reactbits/`: componentes do React Bits (AnimatedContent, FoldText, MaskedHeading).
- `public/img/`: fotos do Wikimedia Commons (créditos no rodapé do site).
