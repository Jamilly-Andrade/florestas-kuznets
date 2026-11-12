# Renda & Floresta

Site interativo, em formato de storytelling, sobre a pergunta:
_Países mais ricos perdem menos floresta? Existe um ponto da renda a partir do qual a destruição para e se reverte em reflorestamento?_

Autora: **Jamilly Andrade de Medeiros** · Orientadora: **Polyana Sampaio Ramos Barbosa**

Todos os números e gráficos vêm da análise estatística de 151 países (1990–2020).

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
- `src/components/reactbits/`: componentes do React Bits (AnimatedContent, MaskedHeading).
- `src/components/text/`: efeitos de texto inspirados no React Bits (VariableTitle, ScrollFloat).
- `public/img/`: fotos do Wikimedia Commons (créditos no rodapé do site).
