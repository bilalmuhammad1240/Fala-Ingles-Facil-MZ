import { Link, useParams, Navigate } from "react-router-dom";
import { findModule } from "../data/curriculum";

export default function Module() {
  const { moduleSlug } = useParams();
  const mod = findModule(moduleSlug);
  if (!mod) return <Navigate to="/" replace />;

  return (
    <>
      <section className="wrap section" style={{ paddingBottom: 0 }}>
        <div className="crumb"><Link to="/">Início</Link> / Módulo {mod.number}</div>
        <div className="section-head">
          <span className="eyebrow">Módulo {mod.number}</span>
          <h2>{mod.title}</h2>
          <p>{mod.description}</p>
        </div>
      </section>
      <section className="wrap section" style={{ paddingTop: 0 }}>
        {mod.lessons.length === 0 && (
          <p style={{ opacity: 0.7 }}>As lições deste módulo estão em preparação.</p>
        )}
        {mod.lessons.map((l) => (
          <Link
            key={l.slug}
            to={l.content ? `/${mod.slug}/${l.slug}` : "#"}
            className="lesson-row"
            style={!l.content ? { opacity: 0.5, pointerEvents: "none" } : {}}
          >
            <span className={`lesson-dot ${l.content ? "done" : "todo"}`}>{l.number}</span>
            <span className="lt">
              <strong>{l.title}</strong>
              <span>{l.subtitle}{!l.content && " · em breve"}</span>
            </span>
            <span className="arrow">→</span>
          </Link>
        ))}
      </section>
      <footer>Fala Inglês Fácil MZ</footer>
    </>
  );
}
