import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { findLesson, findModule } from "../data/curriculum";
import { lesson1 } from "../data/lesson1-content";
import { speak } from "../lib/speech";
import AudioButton from "../components/AudioButton";
import DialoguePlayer from "../components/DialoguePlayer";
import DragFill from "../components/DragFill";
import SentenceBuilder from "../components/SentenceBuilder";
import MatchPairs from "../components/MatchPairs";
import TrueFalse from "../components/TrueFalse";
import ListenType from "../components/ListenType";
import Recorder from "../components/Recorder";
import Reveal from "../components/Reveal";
import "../styles-player.css";

const CONTENT_MAP = { "greetings-and-introductions": lesson1 };

// Índices das secções, por ordem — usados para o desbloqueio progressivo.
const IDX = {
  hero: 0,
  dialogue: 1,
  expressions: 2,
  pattern: 3,
  dragfill: 4,
  sb1: 5,
  sb2: 6,
  match: 7,
  truefalse: 8,
  listen: 9,
  speak: 10,
  challenge: 11,
  quiz: 12,
};
const TOTAL_SECTIONS = 13; // 0..12; a conclusão aparece depois da 12

export default function LessonPlayer() {
  const { moduleSlug, lessonSlug } = useParams();
  const found = findLesson(moduleSlug, lessonSlug);
  const mod = findModule(moduleSlug);
  const c = CONTENT_MAP[lessonSlug];

  const [unlocked, setUnlocked] = useState(1); // quantas secções (0-index) já estão visíveis
  const [mcAnswers, setMcAnswers] = useState({});
  const [listenChecked, setListenChecked] = useState([false, false]);
  const [complete, setComplete] = useState(false);

  if (!found || !found.lesson.content || !c) return <Navigate to={`/${moduleSlug}`} replace />;
  const { lesson } = found;

  function advanceFrom(idx) {
    setUnlocked((u) => Math.max(u, idx + 2));
  }

  function markListenChecked(i) {
    setListenChecked((arr) => {
      const next = [...arr];
      next[i] = true;
      if (next.every(Boolean)) advanceFrom(IDX.listen);
      return next;
    });
  }

  function handleDragFillComplete(filled) {
    const allCorrect = Object.keys(c.dragFillCorrect).every((id) => filled[id] === c.dragFillCorrect[id]);
    if (allCorrect) advanceFrom(IDX.dragfill);
  }

  function isSectionVisible(idx) {
    return idx < unlocked;
  }
  function isFrontier(idx) {
    return idx === unlocked - 1;
  }

  const pct = Math.round((Math.min(unlocked, TOTAL_SECTIONS) / TOTAL_SECTIONS) * 100);

  return (
    <div className="player player-vertical">
      <div className="p-topbar">
        <Link to={`/${moduleSlug}`} className="p-back">←</Link>
        <div className="p-progress-track"><div className="p-progress-fill" style={{ width: `${pct}%` }} /></div>
        <span className="p-progress-pct">{pct}%</span>
      </div>

      <div className="p-wrap p-body-vertical">

        {/* 0. CENÁRIO REAL */}
        {isSectionVisible(IDX.hero) && (
          <Reveal className="v-section v-hero">
            <span className="v-tag">🎬 Situação real</span>
            <h1>{lesson.title}</h1>
            <p className="p-sub">Estás num novo emprego em Maputo e conheces alguém pela primeira vez.</p>
            {isFrontier(IDX.hero) && (
              <button className="p-start-btn" onClick={() => advanceFrom(IDX.hero)}>Continuar →</button>
            )}
          </Reveal>
        )}

        {/* 1. OUVIR O DIÁLOGO */}
        {isSectionVisible(IDX.dialogue) && (
          <Reveal className="v-section">
            <span className="v-tag">👂 Ouve o diálogo</span>
            <DialoguePlayer dialogue={c.informalDialogue} />
            {isFrontier(IDX.dialogue) && (
              <button className="p-start-btn" style={{ marginTop: 18 }} onClick={() => advanceFrom(IDX.dialogue)}>Continuar →</button>
            )}
          </Reveal>
        )}

        {/* 2. EXPRESSÕES CHAVE */}
        {isSectionVisible(IDX.expressions) && (
          <Reveal className="v-section">
            <span className="v-tag">🧠 Expressões chave</span>
            <div className="v-expr-grid">
              {c.vocab.slice(0, 6).map(([en, pt], i) => (
                <div className="v-expr-card v-expr-card-clickable" key={i} onClick={() => speak(en, { rate: 1 })}>
                  <div className="v-expr-top">
                    <span className="en">{en}</span>
                    <AudioButton text={en} showSlow />
                  </div>
                  <span className="pt2">{pt}</span>
                </div>
              ))}
            </div>
            {isFrontier(IDX.expressions) && (
              <button className="p-start-btn" style={{ marginTop: 18 }} onClick={() => advanceFrom(IDX.expressions)}>Continuar →</button>
            )}
          </Reveal>
        )}

        {/* 3. FORMAL VS INFORMAL */}
        {isSectionVisible(IDX.pattern) && (
          <Reveal className="v-section">
            <span className="v-tag">🔍 Repara no padrão</span>
            <p><code>[Saudação] + [Nome] + [Origem/Profissão]</code></p>
            <div className="dialogue-block">
              <span className="label">Diálogo formal — entrevista de emprego</span>
              {c.formalDialogue.map((d, i) => (
                <p key={i}>
                  <span className="who">{d.who}:</span>{d.en}
                  <AudioButton text={d.en} />
                  <span className="pt" style={{ display: "block", opacity: 0.6, fontStyle: "italic", fontSize: "0.88rem" }}>{d.pt}</span>
                </p>
              ))}
            </div>
            {isFrontier(IDX.pattern) && (
              <button className="p-start-btn" style={{ marginTop: 18 }} onClick={() => advanceFrom(IDX.pattern)}>Continuar →</button>
            )}
          </Reveal>
        )}

        {/* 4. COMPLETAR O DIÁLOGO */}
        {isSectionVisible(IDX.dragfill) && (
          <Reveal className="v-section">
            <span className="v-tag">✏️ Completa o diálogo</span>
            <p className="p-chat-hint">Arrasta as palavras para os espaços certos.</p>
            <DragFill
              segments={c.dragFillSegments}
              words={c.dragFillWords}
              correctMap={c.dragFillCorrect}
              onComplete={handleDragFillComplete}
            />
          </Reveal>
        )}

        {/* 5. CONSTRUIR A FRASE */}
        {isSectionVisible(IDX.sb1) && (
          <Reveal className="v-section">
            <span className="v-tag">🧩 Constrói a frase</span>
            <p className="p-chat-hint">Toca as palavras pela ordem certa.</p>
            <SentenceBuilder
              words={c.sentenceBuilder.words}
              correctOrder={c.sentenceBuilder.correctOrder}
              translation={c.sentenceBuilder.translation}
              onComplete={() => advanceFrom(IDX.sb1)}
            />
          </Reveal>
        )}

        {/* 6. MAIS UMA FRASE */}
        {isSectionVisible(IDX.sb2) && (
          <Reveal className="v-section">
            <span className="v-tag">🧩 Mais uma frase</span>
            <p className="p-chat-hint">Agora uma resposta um pouco mais longa.</p>
            <SentenceBuilder
              words={c.sentenceBuilder2.words}
              correctOrder={c.sentenceBuilder2.correctOrder}
              translation={c.sentenceBuilder2.translation}
              onComplete={() => advanceFrom(IDX.sb2)}
            />
          </Reveal>
        )}

        {/* 7. COMBINAR PARES */}
        {isSectionVisible(IDX.match) && (
          <Reveal className="v-section">
            <span className="v-tag">🔗 Combina os pares</span>
            <p className="p-chat-hint">Toca uma frase em inglês e depois a tradução certa em português.</p>
            <MatchPairs pairs={c.matchPairs} onComplete={() => advanceFrom(IDX.match)} />
          </Reveal>
        )}

        {/* 8. VERDADEIRO OU FALSO */}
        {isSectionVisible(IDX.truefalse) && (
          <Reveal className="v-section">
            <span className="v-tag">✅ Verdadeiro ou Falso</span>
            <p className="p-chat-hint">Sobre os diálogos que já viste nesta lição.</p>
            <TrueFalse items={c.trueFalse} onComplete={() => advanceFrom(IDX.truefalse)} />
          </Reveal>
        )}

        {/* 9. OUVE E ESCREVE */}
        {isSectionVisible(IDX.listen) && (
          <Reveal className="v-section">
            <span className="v-tag">👂✏️ Ouve e escreve</span>
            <p className="p-chat-hint">Ouve a frase e escreve exatamente o que ouviste.</p>
            {c.listenType.map((it, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <ListenType text={it.text} hintPt={it.hintPt} onChecked={() => markListenChecked(i)} />
              </div>
            ))}
          </Reveal>
        )}

        {/* 10. FALAR */}
        {isSectionVisible(IDX.speak) && (
          <Reveal className="v-section">
            <span className="v-tag">🎤 A tua vez de falar</span>
            <Recorder prompt="Nice to meet you!" onRecorded={() => advanceFrom(IDX.speak)} />
          </Reveal>
        )}

        {/* 11. DESAFIO REAL */}
        {isSectionVisible(IDX.challenge) && (
          <Reveal className="v-section">
            <span className="v-tag">🌍 Desafio da vida real</span>
            <p>Esta semana, apresenta-te em inglês a uma pessoa real — colega, cliente, ou em voz alta ao espelho.</p>
            <div className="dialogue-block">
              <span className="label">Situação — WhatsApp</span>
              <p>"Hi! I'm Sarah, from Canada. What's your name?" <AudioButton text="Hi! I'm Sarah, from Canada. What's your name?" /></p>
            </div>
            <Recorder prompt="Hi! My name is ____. Nice to meet you!" onRecorded={() => advanceFrom(IDX.challenge)} />
          </Reveal>
        )}

        {/* 12. REVISÃO RÁPIDA */}
        {isSectionVisible(IDX.quiz) && (
          <Reveal className="v-section">
            <span className="v-tag">⚡ Revisão rápida</span>
            {c.multipleChoice.map((mc, i) => (
              <div key={i} className="v-quiz-card">
                <p><b>{mc.q}</b> <AudioButton text={mc.q} /></p>
                {mc.options.map((o, j) => {
                  const key = `${i}`;
                  const letter = String.fromCharCode(97 + j);
                  const chosen = mcAnswers[key] === letter;
                  const isRight = letter === mc.answer;
                  return (
                    <button
                      key={j}
                      type="button"
                      className={`v-quiz-opt ${chosen ? (isRight ? "correct" : "wrong") : ""}`}
                      onClick={() => {
                        const next = { ...mcAnswers, [key]: letter };
                        setMcAnswers(next);
                        if (Object.keys(next).length === c.multipleChoice.length) advanceFrom(IDX.quiz);
                      }}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            ))}
          </Reveal>
        )}

        {/* CONCLUSÃO */}
        {unlocked > IDX.quiz && (
          <Reveal className="v-section">
            {!complete ? (
              <button className="p-start-btn" onClick={() => setComplete(true)}>🏁 Concluir Lição</button>
            ) : (
              <div className="p-complete-card confetti-wrap">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span key={i} className={`confetti c${i % 4}`} style={{ left: `${(i * 4.2) % 100}%`, animationDelay: `${(i % 6) * 0.15}s` }} />
                ))}
                <div className="p-trophy">🏆</div>
                <h2>Lição concluída!</h2>
                <p style={{ color: "var(--p-text-dim)" }}>Parabéns! Completaste "{lesson.title}".</p>
                <ul className="p-learned-list">
                  <li>✅ Cumprimentar formalmente e informalmente</li>
                  <li>✅ Apresentar-me com nome e origem</li>
                  <li>✅ Perguntar e responder sobre profissão</li>
                </ul>
                <div className="p-complete-actions">
                  <Link to={`/${moduleSlug}`} className="p-btn-solid">Voltar ao Módulo</Link>
                </div>
              </div>
            )}
          </Reveal>
        )}

        {/* PRÓXIMA SECÇÃO BLOQUEADA (indicador visual) */}
        {unlocked <= IDX.quiz && (
          <div className="v-locked">
            🔒 Completa a secção acima para continuares
          </div>
        )}

      </div>
    </div>
  );
}
