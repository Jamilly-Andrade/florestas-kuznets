import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function Tex({ children, block = false }) {
  const html = katex.renderToString(children, { displayMode: block, throwOnError: false, output: 'html' });
  return <span className={block ? 'tex tex--block' : 'tex'} dangerouslySetInnerHTML={{ __html: html }} />;
}
