import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { findLesson } from "../data/curriculum";
import { lesson1 } from "../data/lesson1-content";
import { speak } from "../lib/speech";
import AudioButton from "../components/AudioButton";
import DialoguePlayer from "../components/DialoguePlayer";
import SentenceBuilder from "../components/SentenceBuilder";
import MatchPairs from "../components/MatchPairs";
import MultipleChoice from "../components/MultipleChoice";
import TextFill from "../components/TextFill";
import WriteSentence from "../components/WriteSentence";
import ConversationSim from "../components/ConversationSim";
import Recorder from "../components/Recorder";
import Reveal from "../components/Reveal";
import "../styles-player.css";

const CONTENT_MAP = { "greetings-and-introductions": lesson1 };

function NextArrow({ onClick }) {
  return (
    <button className="p-next-arrow" aria-label="Continuar" onClick={onClick}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}

// Um pequeno hook local para secções com vários itens que têm de estar
// todos "resolvidos" antes de avançar (Listening, Recognition, Practice...).
function useScored(n) {
  const [arr, setArr] = useState(Array(n).fill(null)); // null | true | false
  function mark(i, correct) {
    setArr((a) => {
      const next = [...a];
      next[i] = correct;
      return next;
    });
  }
  const allDone = arr.every((v) => v !== null);
  const correctCount = arr.filter((v) => v === true).length;
  return [arr, mark, allDone, correctCount];
}

// Índices das secções, seguindo a estrutura recomendada no guia (secção 27).
const IDX = {
  hero: 0,
  warmup: 1,
  targetLanguage: 2,
  listening: 3,
  recognition: 4,
  practice: 5,
  pronunciation: 6,
  speaking: 7,
  writing: 8,
  conversation: 9,
  challenge: 10,
  assessment: 11,
  review: 12,
};
const TOTAL_SECTIONS = 13; // 0..12; a conclusão aparece depois da 12

export default function LessonPlayer() {
  const { moduleSlug, lessonSlug } = useParams();
  const found = findLesson(moduleSlug, lessonSlug);
  const c = CONTENT_MAP[lessonSlug];

  const [unlocked, setUnlocked] = useState(1);
  const [complete, setComplete] = useState(false);

  // --- Warm-up ---
  const [warmupScores, markWarmup, warmupAllDone] = useScored(c ? c.warmupCheck.length : 0);

  // --- Target language ---
  const [targetMatchDone, setTargetMatchDone] = useState(false);

  // --- Listening (5 sub-exercícios) ---
  const [listenName, setListenName] = useState(false);
  const [listenCountry, setListenCountry] = useState(false);
  const [listenMeaning, setListenMeaning] = useState(false);
  const [listenOrder, setListenOrder] = useState(false);
  const [listenQA, markListenQA, listenQADone] = useScored(2);
  const listeningAllDone = listenName && listenCountry && listenMeaning && listenOrder && listenQADone;

  // --- Recognition (4 MC + 1 match) ---
  const [recogScores, markRecog, recogAllDone] = useScored(c ? c.recognition.length : 0);
  const [recogMatchDone, setRecogMatchDone] = useState(false);
  const recognitionSectionDone = recogAllDone && recogMatchDone;

  // --- Controlled practice (5 itens) ---
  const [pNameDone, setPNameDone] = useState(false);
  const [pFromDone, setPFromDone] = useState(false);
  const [pReorder1Done, setPReorder1Done] = useState(false);
  const [pReorder2Done, setPReorder2Done] = useState(false);
  const [pMCDone, setPMCDone] = useState(false);
  const practiceAllDone = pNameDone && pFromDone && pReorder1Done && pReorder2Done && pMCDone;

  // --- Pronunciation (4 alvos gravados) ---
  const [pronounced, setPronounced] = useState([false, false, false, false]);
  const pronunciationAllDone = pronounced.every(Boolean);
  function markPronounced(i) {
    setPronounced((a) => {
      const next = [...a];
      next[i] = true;
      return next;
    });
  }

  // --- Speaking (4 passos + 1 mini apresentação livre) ---
  const [spokenSteps, setSpokenSteps] = useState([false, false, false, false]);
  const [spokenFinal, setSpokenFinal] = useState(false);
  const speakingAllDone = spokenSteps.every(Boolean) && spokenFinal;
  function markSpokenStep(i) {
    setSpokenSteps((a) => {
      const next = [...a];
      next[i] = true;
      return next;
    });
  }

  // --- Writing (5 itens) ---
  const [wNameDone, setWNameDone] = useState(false);
  const [wCountryDone, setWCountryDone] = useState(false);
  const [wReorderDone, setWReorderDone] = useState(false);
  const [wCorrectDone, setWCorrectDone] = useState(false);
  const [wFullDone, setWFullDone] = useState(false);
  const writingAllDone = wNameDone && wCountryDone && wReorderDone && wCorrectDone && wFullDone;

  // --- Conversation & Challenge ---
  const [conversationDone, setConversationDone] = useState(false);
  const [challengeDone, setChallengeDone] = useState(false);

  // --- Final Assessment (Partes A–E) ---
  const [aListen, markAListen, aListenDone, aListenCorrect] = useScored(c ? c.assessmentListening.length : 0);
  const [aVocab, markAVocab, aVocabDone, aVocabCorrect] = useScored(c ? c.assessmentVocab.length : 0);
  const [aSent, markASent, aSentDone, aSentCorrect] = useScored(c ? c.assessmentSentences.length : 0);
  const [aSpeakDone, setASpeakDone] = useState(false);
  const [aConvDone, setAConvDone] = useState(false);
  const assessmentAllDone = aListenDone && aVocabDone && aSentDone && aSpeakDone && aConvDone;

  if (!found || !found.lesson.content || !c) return <Navigate to={`/${moduleSlug}`} replace />;
  const { lesson } = found;

  function advanceFrom(idx) {
    setUnlocked((u) => Math.max(u, idx + 2));
  }

  function isSectionVisible(idx) {
    return idx < unlocked;
  }
  function isFrontier(idx) {
    return idx === unlocked - 1;
  }

  const pct = Math.round((Math.min(unlocked, TOTAL_SECTIONS) / TOTAL_SECTIONS) * 100);

  const listenPct = Math.round((aListenCorrect / c.assessmentListening.length) * 100);
  const vocabPct = Math.round((aVocabCorrect / c.assessmentVocab.length) * 100);
  const sentPct = Math.round((aSentCorrect / c.assessmentSentences.length) * 100);
  const essentialsPassed = listenPct >= 80 && vocabPct >= 80 && sentPct >= 80;

  return (
    <div className="player player-vertical">
      <div className="p-topbar">
        <Link to={`/${moduleSlug}`} className="p-back">←</Link>
        <div className="p-progress-track"><div className="p-progress-fill" style={{ width: `${pct}%` }} /></div>
        <span className="p-progress-pct">{pct}%</span>
      </div>

      <div className="p-wrap p-body-vertical">

        {/* 0. CENÁRIO REAL / WARM-UP */}
        {isSectionVisible(IDX.hero) && (
          <Reveal className="v-section v-hero">
            <span className="v-tag">🎬 Situação real</span>
            <h1>{lesson.title}</h1>
            <p className="p-sub">Acabaste de conhecer alguém. Vais aprender a cumprimentar e a apresentar-te em inglês.</p>
            {isFrontier(IDX.hero) && <NextArrow onClick={() => advanceFrom(IDX.hero)} />}
          </Reveal>
        )}

        {/* 1. WARM-UP: DIÁLOGO + COMPREENSÃO */}
        {isSectionVisible(IDX.warmup) && (
          <Reveal className="v-section">
            <span className="v-tag">👂 Duas pessoas conhecem-se</span>
            <DialoguePlayer dialogue={c.warmupDialogue.map((d) => ({ who: d.who, en: d.en, pt: d.pt }))} />
            <div style={{ marginTop: 20 }}>
              {c.warmupCheck.map((item, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <MultipleChoice
                    q={item.q}
                    options={item.options}
                    answer={item.answer}
                    onComplete={(ok) => {
                      markWarmup(i, ok);
                      if (i === c.warmupCheck.length - 1) advanceFrom(IDX.warmup);
                    }}
                  />
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* 2. TARGET LANGUAGE */}
        {isSectionVisible(IDX.targetLanguage) && (
          <Reveal className="v-section">
            <span className="v-tag">🧠 As 4 frases desta aula</span>
            <div className="v-expr-grid">
              {c.targetSentences.map(({ en, pt }, i) => (
                <div className="v-expr-card v-expr-card-clickable" key={i} onClick={() => speak(en, { rate: 1 })}>
                  <div className="v-expr-top">
                    <span className="en">{en}</span>
                    <AudioButton text={en} showSlow />
                  </div>
                  <span className="pt2">{pt}</span>
                </div>
              ))}
            </div>
            <p className="p-chat-hint" style={{ marginTop: 14 }}>Também vais ouvir estas variações — só para reconheceres, não precisas de as usar ainda:</p>
            <div className="v-expr-grid">
              {c.recognitionVariants.map(({ en, pt }, i) => (
                <div className="v-expr-card v-expr-card-clickable" key={i} onClick={() => speak(en, { rate: 1 })}>
                  <div className="v-expr-top">
                    <span className="en">{en}</span>
                    <AudioButton text={en} showSlow />
                  </div>
                  <span className="pt2">{pt}</span>
                </div>
              ))}
            </div>
            <p className="p-chat-hint" style={{ marginTop: 20 }}>Agora liga cada frase ao seu significado:</p>
            <MatchPairs
              pairs={c.targetMatch}
              onComplete={() => {
                setTargetMatchDone(true);
                advanceFrom(IDX.targetLanguage);
              }}
            />
          </Reveal>
        )}

        {/* 3. LISTENING */}
        {isSectionVisible(IDX.listening) && (
          <Reveal className="v-section">
            <span className="v-tag">👂 Listening</span>

            <p className="p-chat-hint">1. Ouve e escolhe o nome certo.</p>
            <MultipleChoice
              audioText={c.listeningName.audio}
              q={c.listeningName.q}
              options={c.listeningName.options}
              answer={c.listeningName.answer}
              onComplete={() => setListenName(true)}
            />

            <p className="p-chat-hint" style={{ marginTop: 20 }}>2. Ouve e escolhe o país certo.</p>
            <MultipleChoice
              audioText={c.listeningCountry.audio}
              q={c.listeningCountry.q}
              options={c.listeningCountry.options}
              answer={c.listeningCountry.answer}
              onComplete={() => setListenCountry(true)}
            />

            <p className="p-chat-hint" style={{ marginTop: 20 }}>3. Ouve e escolhe o significado certo.</p>
            <MultipleChoice
              audioText={c.listeningMeaning.audio}
              q={c.listeningMeaning.q}
              options={c.listeningMeaning.options}
              answer={c.listeningMeaning.answer}
              onComplete={() => setListenMeaning(true)}
            />

            <p className="p-chat-hint" style={{ marginTop: 20 }}>4. Ouve a apresentação completa e ordena as frases.</p>
            <button type="button" className="audio-btn big" onClick={() => speak(c.listeningOrder.audio, { rate: 0.9 })}>🔊 Ouvir</button>
            <div style={{ marginTop: 10 }}>
              <SentenceBuilder
                words={c.listeningOrder.words}
                correctOrder={c.listeningOrder.correctOrder}
                translation={c.listeningOrder.translation}
                onComplete={() => setListenOrder(true)}
              />
            </div>

            <p className="p-chat-hint" style={{ marginTop: 20 }}>5. Ouve a apresentação e responde.</p>
            <button type="button" className="audio-btn big" onClick={() => speak(c.listeningQA.audio, { rate: 0.9 })}>🔊 Ouvir</button>
            {c.listeningQA.questions.map((item, i) => (
              <div key={i} style={{ marginTop: 12 }}>
                <MultipleChoice
                  q={item.q}
                  options={item.options}
                  answer={item.answer}
                  onComplete={(ok) => markListenQA(i, ok)}
                />
              </div>
            ))}

            {listeningAllDone && <NextArrow onClick={() => advanceFrom(IDX.listening)} />}
          </Reveal>
        )}

        {/* 4. RECOGNITION */}
        {isSectionVisible(IDX.recognition) && (
          <Reveal className="v-section">
            <span className="v-tag">🔍 Recognition</span>
            {c.recognition.map((item, i) => (
              <div key={i} style={{ marginBottom: 18 }}>
                <MultipleChoice
                  audioText={item.audioText}
                  q={item.q}
                  options={item.options}
                  answer={item.answer}
                  onComplete={(ok) => markRecog(i, ok)}
                />
              </div>
            ))}
            <p className="p-chat-hint" style={{ marginTop: 6 }}>Agora liga cada frase à situação certa:</p>
            <MatchPairs pairs={c.recognitionMatch} onComplete={() => setRecogMatchDone(true)} />
            {recognitionSectionDone && <NextArrow onClick={() => advanceFrom(IDX.recognition)} />}
          </Reveal>
        )}

        {/* 5. CONTROLLED PRACTICE */}
        {isSectionVisible(IDX.practice) && (
          <Reveal className="v-section">
            <span className="v-tag">✏️ Controlled Practice</span>

            <p className="p-chat-hint">1. Completa com o teu nome.</p>
            <TextFill
              prompt={c.practiceNameFill.prompt}
              placeholder={c.practiceNameFill.placeholder}
              mode="free"
              onComplete={() => setPNameDone(true)}
            />

            <p className="p-chat-hint" style={{ marginTop: 20 }}>2. Completa com o país certo.</p>
            <TextFill
              prompt={c.practiceFromFill.prompt}
              placeholder={c.practiceFromFill.placeholder}
              mode="exact"
              expected={c.practiceFromFill.expected}
              onComplete={() => setPFromDone(true)}
            />

            <p className="p-chat-hint" style={{ marginTop: 20 }}>3. Ordena as palavras.</p>
            <SentenceBuilder
              words={c.practiceReorder1.words}
              correctOrder={c.practiceReorder1.correctOrder}
              translation={c.practiceReorder1.translation}
              onComplete={() => setPReorder1Done(true)}
            />

            <p className="p-chat-hint" style={{ marginTop: 20 }}>4. Ordena as palavras.</p>
            <SentenceBuilder
              words={c.practiceReorder2.words}
              correctOrder={c.practiceReorder2.correctOrder}
              translation={c.practiceReorder2.translation}
              onComplete={() => setPReorder2Done(true)}
            />

            <p className="p-chat-hint" style={{ marginTop: 20 }}>5. Escolhe a melhor resposta.</p>
            <MultipleChoice
              q={c.practiceMC.q}
              options={c.practiceMC.options}
              answer={c.practiceMC.answer}
              onComplete={() => setPMCDone(true)}
            />

            {practiceAllDone && <NextArrow onClick={() => advanceFrom(IDX.practice)} />}
          </Reveal>
        )}

        {/* 6. PRONUNCIATION */}
        {isSectionVisible(IDX.pronunciation) && (
          <Reveal className="v-section">
            <span className="v-tag">🗣️ Pronunciation</span>
            <p className="p-chat-hint">Ouve o modelo, ouve devagar se precisares, repete, grava-te e ouve-te. Podes tentar quantas vezes quiseres.</p>
            {c.pronunciationTargets.map((text, i) => (
              <div key={i} className="dialogue-block" style={{ marginBottom: 16 }}>
                <span className="label">{text}</span>
                <AudioButton text={text} showSlow size="lg" />
                <Recorder prompt={text} onRecorded={() => markPronounced(i)} />
              </div>
            ))}
            {pronunciationAllDone && <NextArrow onClick={() => advanceFrom(IDX.pronunciation)} />}
          </Reveal>
        )}

        {/* 7. SPEAKING */}
        {isSectionVisible(IDX.speaking) && (
          <Reveal className="v-section">
            <span className="v-tag">🎤 Speaking</span>
            {c.speakingSteps.map((step, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <p className="p-chat-hint">{step.instruction}</p>
                <Recorder prompt={step.prompt} onRecorded={() => markSpokenStep(i)} />
              </div>
            ))}
            {spokenSteps.every(Boolean) && (
              <div style={{ marginTop: 8 }}>
                <p className="p-chat-hint"><b>{c.speakingFinal.instruction}</b> — {c.speakingFinal.prompt}</p>
                <Recorder prompt="Hello. My name is ____. I am from ____. Nice to meet you." onRecorded={() => setSpokenFinal(true)} />
              </div>
            )}
            {speakingAllDone && <NextArrow onClick={() => advanceFrom(IDX.speaking)} />}
          </Reveal>
        )}

        {/* 8. WRITING */}
        {isSectionVisible(IDX.writing) && (
          <Reveal className="v-section">
            <span className="v-tag">✍️ Writing</span>

            <p className="p-chat-hint">1. Completa com o teu nome.</p>
            <TextFill
              prompt={c.writingName.prompt}
              placeholder={c.writingName.placeholder}
              mode="free"
              onComplete={() => setWNameDone(true)}
            />

            <p className="p-chat-hint" style={{ marginTop: 20 }}>2. Completa com o país certo.</p>
            <TextFill
              prompt={c.writingCountry.prompt}
              placeholder={c.writingCountry.placeholder}
              mode="exact"
              expected={c.writingCountry.expected}
              onComplete={() => setWCountryDone(true)}
            />

            <p className="p-chat-hint" style={{ marginTop: 20 }}>3. Ordena as palavras.</p>
            <SentenceBuilder
              words={c.writingReorder.words}
              correctOrder={c.writingReorder.correctOrder}
              translation={c.writingReorder.translation}
              onComplete={() => setWReorderDone(true)}
            />

            <p className="p-chat-hint" style={{ marginTop: 20 }}>4. {c.writingCorrect.instruction}</p>
            <p className="p-sub" style={{ margin: "4px 0" }}>"{c.writingCorrect.wrong}"</p>
            <WriteSentence
              placeholder="Escreve a frase corrigida..."
              expected={c.writingCorrect.expected}
              onComplete={() => setWCorrectDone(true)}
            />

            <p className="p-chat-hint" style={{ marginTop: 20 }}>5. {c.writingFull.instruction}</p>
            <WriteSentence
              placeholder="Hello. My name is..."
              freeform
              model={c.writingFull.model}
              onComplete={() => setWFullDone(true)}
            />

            {writingAllDone && <NextArrow onClick={() => advanceFrom(IDX.writing)} />}
          </Reveal>
        )}

        {/* 9. CONVERSATION SIMULATION */}
        {isSectionVisible(IDX.conversation) && (
          <Reveal className="v-section">
            <span className="v-tag">💬 Conversation Simulation</span>
            <p className="p-chat-hint">Escreve as tuas respostas em inglês — não são de escolha múltipla.</p>
            <ConversationSim
              steps={c.conversation}
              onComplete={() => {
                setConversationDone(true);
                advanceFrom(IDX.conversation);
              }}
            />
          </Reveal>
        )}

        {/* 10. REAL-LIFE CHALLENGE */}
        {isSectionVisible(IDX.challenge) && (
          <Reveal className="v-section">
            <span className="v-tag">🌍 Real-life Challenge</span>
            <p>{c.challenge.instruction}</p>
            <div className="dialogue-block">
              <span className="label">Situação — WhatsApp</span>
              <p>"{c.challenge.example.en}" <AudioButton text={c.challenge.example.en} /></p>
              <p className="pt2">{c.challenge.example.pt}</p>
            </div>
            <Recorder prompt={c.challenge.prompt} onRecorded={() => { setChallengeDone(true); advanceFrom(IDX.challenge); }} />
          </Reveal>
        )}

        {/* 11. FINAL ASSESSMENT */}
        {isSectionVisible(IDX.assessment) && (
          <Reveal className="v-section">
            <span className="v-tag">📝 Final Assessment</span>

            <p className="p-chat-hint"><b>Parte A — Listening</b></p>
            {c.assessmentListening.map((item, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <MultipleChoice
                  audioText={item.audio}
                  q={item.q}
                  options={item.options}
                  answer={item.answer}
                  onComplete={(ok) => markAListen(i, ok)}
                />
              </div>
            ))}

            <p className="p-chat-hint" style={{ marginTop: 12 }}><b>Parte B — Vocabulary</b></p>
            {c.assessmentVocab.map((item, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <MultipleChoice
                  q={item.q}
                  options={item.options}
                  answer={item.answer}
                  onComplete={(ok) => markAVocab(i, ok)}
                />
              </div>
            ))}

            <p className="p-chat-hint" style={{ marginTop: 12 }}><b>Parte C — Sentence Construction</b></p>
            {c.assessmentSentences.map((item, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <SentenceBuilder
                  words={item.words}
                  correctOrder={item.correctOrder}
                  translation={item.translation}
                  onComplete={(ok) => markASent(i, ok)}
                />
              </div>
            ))}

            <p className="p-chat-hint" style={{ marginTop: 12 }}><b>Parte D — Speaking</b></p>
            <p className="p-chat-hint">{c.assessmentSpeaking.instruction} — {c.assessmentSpeaking.prompt}</p>
            <Recorder prompt="Hello. My name is ____. I am from ____. Nice to meet you." onRecorded={() => setASpeakDone(true)} />

            <p className="p-chat-hint" style={{ marginTop: 20 }}><b>Parte E — Conversation</b></p>
            <ConversationSim steps={c.assessmentConversation} onComplete={() => setAConvDone(true)} />

            {assessmentAllDone && (
              <div className="p-complete-card" style={{ marginTop: 20 }}>
                <p><b>Listening:</b> {aListenCorrect}/{c.assessmentListening.length} ({listenPct}%)</p>
                <p><b>Vocabulary:</b> {aVocabCorrect}/{c.assessmentVocab.length} ({vocabPct}%)</p>
                <p><b>Sentence Construction:</b> {aSentCorrect}/{c.assessmentSentences.length} ({sentPct}%)</p>
                <p><b>Speaking:</b> ✅ Completo</p>
                <p><b>Conversation:</b> ✅ Completo</p>
                {essentialsPassed ? (
                  <p style={{ color: "var(--p-teal)", fontWeight: 700, marginTop: 10 }}>✅ Atingiste o objetivo mínimo desta aula!</p>
                ) : (
                  <p style={{ color: "var(--p-coral)", fontWeight: 700, marginTop: 10 }}>Ainda não chegaste a 80% em todas as partes — vale a pena rever antes de continuar.</p>
                )}
                <NextArrow onClick={() => advanceFrom(IDX.assessment)} />
              </div>
            )}
          </Reveal>
        )}

        {/* 12. REVIEW */}
        {isSectionVisible(IDX.review) && (
          <Reveal className="v-section">
            <span className="v-tag">🔁 Review</span>
            <p>Nesta aula, praticaste as mesmas 4 frases em várias tarefas diferentes:</p>
            <ul className="p-learned-list">
              <li>👂 Listening — reconhecer ao ouvir</li>
              <li>🧩 Ordenar e construir frases</li>
              <li>🗣️ Pronunciation e Speaking — dizer em voz alta</li>
              <li>✍️ Writing — escrever</li>
              <li>💬 Conversation — usar numa conversa real</li>
            </ul>
            <p style={{ marginTop: 10 }}><b>Consegues agora:</b></p>
            <p className="p-sub">Hello. My name is ____. I am from ____. Nice to meet you.</p>
            {isFrontier(IDX.review) && <NextArrow onClick={() => advanceFrom(IDX.review)} />}
          </Reveal>
        )}

        {/* CONCLUSÃO */}
        {unlocked > IDX.review && (
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
                  <li>✅ Cumprimentar alguém</li>
                  <li>✅ Dizer o meu nome</li>
                  <li>✅ Dizer de onde sou</li>
                  <li>✅ Reagir a uma apresentação com simpatia</li>
                </ul>
                <div className="p-complete-actions">
                  <Link to={`/${moduleSlug}`} className="p-btn-solid">Voltar ao Módulo</Link>
                </div>
              </div>
            )}
          </Reveal>
        )}

        {/* PRÓXIMA SECÇÃO BLOQUEADA (indicador visual) */}
        {unlocked <= IDX.review && (
          <div className="v-locked">
            🔒 Completa a secção acima para continuares
          </div>
        )}

      </div>
    </div>
  );
}
