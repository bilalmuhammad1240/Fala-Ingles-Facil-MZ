import { Link } from "react-router-dom";
import { modules } from "../data/curriculum";

const tickerPhrases = [
  ["Hello, how are you?", "Olá, como estás?"],
  ["I'm from Mozambique", "Sou de Moçambique"],
  ["Nice to meet you", "Prazer em conhecer-te"],
  ["Where are you from?", "De onde és?"],
  ["See you later", "Até logo"],
  ["What do you do?", "O que fazes?"],
];

export default function Home() {
  const doneLessons = modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.content).length,
    0
  );
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <>
      <section className="wrap hero">
        <div>
          <span className="eyebrow">Curso de Inglês · Feito para Moçambique</span>
          <h1>Aprende inglês falando, desde o primeiro dia.</h1>
          <p className="lead">
            Um curso passo a passo, em português, para quem quer falar inglês
            com confiança — no trabalho, na viagem, na vida. Cada lição liga-se
            à anterior, para o conhecimento nunca ficar solto.
          </p>
          <div className="cta-row">
            <Link to="/modulo-1" className="btn btn-primary">Começar Módulo 1</Link>
            <Link to="/modulo-1/greetings-and-introductions" className="btn btn-ghost">Ver uma lição</Link>
          </div>
        </div>
        <div className="convo-card">
          <div className="bubble them">
            Hi! I'm Sarah, from Canada. What's your name?
            <span className="pt">Oi! Sou a Sarah, do Canadá. Qual é o teu nome?</span>
          </div>
          <div className="bubble me">
            Hello Sarah! I'm from Mozambique. Nice to meet you.
            <span className="pt">Olá Sarah! Sou de Moçambique. Prazer.</span>
          </div>
          <div className="bubble them">
            Nice to meet you too!
            <span className="pt">Igualmente!</span>
          </div>
        </div>
      </section>

      <div className="ticker-section">
        <div className="ticker-track">
          {[...tickerPhrases, ...tickerPhrases].map(([en, pt], i) => (
            <span key={i}><b>{en}</b> — {pt}</span>
          ))}
        </div>
      </div>

      <section className="wrap section">
        <div className="section-head">
          <h2>O percurso completo</h2>
          <p>
            {doneLessons} de {totalLessons || "muitas"} lições já publicadas neste módulo. Os
            restantes módulos estão a ser construídos, um de cada vez, sem pressa e sem lacunas.
          </p>
        </div>
        <div className="module-grid">
          {modules.map((m) => {
            const readyCount = m.lessons.filter((l) => l.content).length;
            const pct = m.lessons.length ? Math.round((readyCount / m.lessons.length) * 100) : 0;
            return (
              <Link key={m.slug} to={`/${m.slug}`} className="module-card">
                <span className="num">Módulo {m.number}</span>
                <h3>{m.title}</h3>
                <p>{m.description}</p>
                {m.lessons.length === 0 ? (
                  <span className="locked-tag">Em preparação</span>
                ) : (
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      <footer>Fala Inglês Fácil MZ — feito com cuidado, em Moçambique.</footer>
    </>
  );
}
