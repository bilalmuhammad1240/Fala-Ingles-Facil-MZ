import { Link, useParams, Navigate } from "react-router-dom";
import { findLesson } from "../data/curriculum";
import { lesson1 } from "../data/lesson1-content";

const CONTENT_MAP = {
  "greetings-and-introductions": lesson1,
};

export default function Lesson() {
  const { moduleSlug, lessonSlug } = useParams();
  const found = findLesson(moduleSlug, lessonSlug);
  if (!found || !found.lesson.content) return <Navigate to={`/${moduleSlug}`} replace />;

  const { module: mod, lesson } = found;
  const c = CONTENT_MAP[lessonSlug];
  if (!c) return <Navigate to={`/${moduleSlug}`} replace />;

  return (
    <>
      <div className="lesson-header">
        <div className="wrap">
          <div className="crumb">
            <Link to="/">Início</Link> / <Link to={`/${mod.slug}`}>Módulo {mod.number}</Link> / Lição {lesson.number}
          </div>
          <h1>{lesson.title}</h1>
          <p style={{ opacity: 0.7, margin: 0 }}>{lesson.subtitle}</p>
          <div className="can-do"><b>Vais conseguir:</b> {lesson.canDo}</div>
        </div>
      </div>

      {/* ESTÁGIO 1 — INPUT */}
      <section className="stage">
        <div className="wrap">
          <span className="stage-tag">Estágio 1 · Exposição</span>
          <h2>Contexto e vocabulário</h2>
          <p>
            Imagina que chegas a um novo emprego em Maputo e conheces o teu novo chefe, um
            colega e a receção. Em cada situação, o inglês muda de tom — mais formal com o
            chefe, mais casual com um colega da tua idade.
          </p>
          <table className="vocab">
            <thead>
              <tr><th>Inglês</th><th>Português</th><th>Pronúncia</th></tr>
            </thead>
            <tbody>
              {c.vocab.map(([en, pt, pron], i) => (
                <tr key={i}><td>{en}</td><td>{pt}</td><td>{pron}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="note-block">
            Em Moçambique é comum cumprimentar com calma e perguntar pela família. Em inglês,
            "How are you?" costuma ser retórico — a resposta esperada é curta: "Fine, thanks!"
          </div>
        </div>
      </section>

      {/* ESTÁGIO 2 — NOTICING */}
      <section className="stage">
        <div className="wrap">
          <span className="stage-tag">Estágio 2 · Observar o padrão</span>
          <h2>Formal vs. Informal</h2>
          <p><code>[Saudação] + [Nome] + [Origem/Profissão]</code></p>

          <div className="dialogue-block">
            <span className="label">Diálogo A — Formal (entrevista de emprego)</span>
            {c.formalDialogue.map((d, i) => (
              <p key={i}><span className="who">{d.who}:</span>{d.en}<span className="pt" style={{display:"block",opacity:0.6,fontStyle:"italic",fontSize:"0.88rem"}}>{d.pt}</span></p>
            ))}
          </div>

          <div className="dialogue-block">
            <span className="label">Diálogo B — Informal (colegas de escola)</span>
            {c.informalDialogue.map((d, i) => (
              <p key={i}><span className="who">{d.who}:</span>{d.en}<span className="pt" style={{display:"block",opacity:0.6,fontStyle:"italic",fontSize:"0.88rem"}}>{d.pt}</span></p>
            ))}
          </div>

          <div className="note-block">
            Repara: no Diálogo A usa-se "Ms. Silva" (título neutro, sem indicar estado civil —
            em Moçambique o nome da mulher não muda com o casamento, e "Ms." reflete isso melhor
            que "Mrs."); no B, só o primeiro nome. "Nice to meet you" aparece só no formal.
          </div>
        </div>
      </section>

      {/* ESTÁGIO 3 — GUIDED PRACTICE */}
      <section className="stage">
        <div className="wrap">
          <span className="stage-tag">Estágio 3 · Prática guiada</span>
          <h2>Agora tenta tu</h2>

          <div className="exercise-block">
            <span className="exn">Exercício 1 — Completa o diálogo</span>
            <p>Palavras: {c.fillBlank.words.join(", ")}</p>
            {c.fillBlank.lines.map((l, i) => <p key={i}>{l}</p>)}
          </div>

          <div className="exercise-block">
            <span className="exn">Exercício 2 — Ordena a frase</span>
            {c.reorder.map((r, i) => <p key={i}>{i + 1}. {r}</p>)}
          </div>

          <div className="exercise-block">
            <span className="exn">Exercício 3 — Escolhe a resposta certa</span>
            {c.multipleChoice.map((mc, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <p style={{ marginBottom: 4 }}><b>{mc.q}</b></p>
                {mc.options.map((o, j) => (
                  <p key={j} style={{ margin: "2px 0" }}>{String.fromCharCode(97 + j)}) {o}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESTÁGIO 4 — COMMUNICATIVE */}
      <section className="stage">
        <div className="wrap">
          <span className="stage-tag">Estágio 4 · Produção livre</span>
          <h2>Cria a tua apresentação</h2>
          <p>Escreve 4 frases sobre ti, usando o esqueleto do Estágio 2: saudação, nome, origem, profissão.</p>
          <div className="note-block">
            <b>Role-play:</b> escolhe um cenário e representa o diálogo em voz alta — (1) conheces
            o gerente do banco (formal); (2) conheces um novo vizinho (informal); (3) numa loja,
            o vendedor pergunta o teu nome.
          </div>
        </div>
      </section>

      {/* ESTÁGIO 5 — REAL LIFE */}
      <section className="stage">
        <div className="wrap">
          <span className="stage-tag">Estágio 5 · Aplicação real</span>
          <h2>Missão da semana</h2>
          <p>
            Apresenta-te em inglês a pelo menos uma pessoa esta semana — um colega, um cliente,
            ou até em voz alta em frente ao espelho. Usa pelo menos 3 frases desta lição.
          </p>
          <div className="dialogue-block">
            <span className="label">Situação real — WhatsApp</span>
            <p>"Hi! I'm Sarah, from Canada. What's your name?"</p>
          </div>
        </div>
      </section>

      {/* ESTÁGIO 6 — REVIEW */}
      <section className="stage" style={{ borderBottom: "none" }}>
        <div className="wrap">
          <span className="stage-tag">Estágio 6 · Revisão</span>
          <h2>Consegues fazer isto sem olhar para trás?</h2>
          <ul className="checklist">
            <li>Cumprimentar formalmente e informalmente</li>
            <li>Dizer o teu nome de duas formas diferentes ("I'm..." e "My name is...")</li>
            <li>Perguntar e responder "de onde és?"</li>
            <li>Perguntar e responder sobre profissão</li>
            <li>Despedir-te de forma apropriada</li>
          </ul>

          <div className="next-bridge">
            <span className="eyebrow">A seguir</span>
            <h3>Lição 2 — This, That & Plurals</h3>
            <p>
              Vais reutilizar "I'm..." e aprender "This is..." para apresentar não só pessoas,
              mas coisas — por exemplo: "This is my friend Carlos. He is from Tete."
            </p>
          </div>
        </div>
      </section>

      <footer>Fala Inglês Fácil MZ</footer>
    </>
  );
}
