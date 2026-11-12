export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <p className="footer__brand">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2 L19 13 H15 L20 20 H4 L9 13 H5 Z" fill="currentColor" />
          </svg>
          Renda &amp; Floresta
        </p>
        <dl className="footer__people">
          <div>
            <dt>Autora</dt>
            <dd>Jamilly Andrade de Medeiros</dd>
          </div>
          <div>
            <dt>Orientadora</dt>
            <dd>Polyana Sampaio Ramos Barbosa</dd>
          </div>
        </dl>
      </div>
    </footer>
  );
}
