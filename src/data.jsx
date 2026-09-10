import React from "react";

const ACCENTS = ["#E8743B", "#1F9E89", "#C6408D"];

function speak(text) {
  try {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.78;
    window.speechSynthesis.speak(u);
  } catch (e) {
    /* speech synthesis unavailable */
  }
}

function SoundBars({ color = "#E8743B" }) {
  const h = [6, 12, 8, 14, 6];
  return (
    <span className="inline-flex items-end gap-[2px] h-5" aria-hidden="true">
      {h.map((v, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full soundbar"
          style={{ background: color, height: `${v}px`, animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </span>
  );
}

/* ---------------------------------------------------------
   LESSON DATA
--------------------------------------------------------- */

const LESSON1 = {
  id: 1,
  title: "Olá! Quem é você?",
  subtitle: "Cumprimentar e apresentar-se",
  accent: ACCENTS[0],
  hookEn: "Hello! My name is Ana.",
  hookPt: "Olá! O meu nome é Ana.",
  grammarTitle: "O verbo \"to be\" (am / is / are)",
  grammarPt:
    "Em português dizemos \"eu sou\", \"ele é\", \"nós somos\" — em inglês, todos vêm de UM só verbo: to be. Ele muda consoante quem fala.",
  pattern: [
    { en: "I am (I'm)", pt: "eu sou / estou" },
    { en: "You are (You're)", pt: "tu és / você são" },
    { en: "He / She / It is", pt: "ele / ela é" },
    { en: "We are", pt: "nós somos" },
    { en: "They are", pt: "eles são" },
  ],
  examples: [
    { en: "I am from Maputo.", pt: "Eu sou de Maputo." },
    { en: "She is a teacher.", pt: "Ela é professora." },
    { en: "They are students.", pt: "Eles são estudantes." },
  ],
  vocab: [
    ["name", "nome"],
    ["teacher", "professor(a)"],
    ["student", "estudante"],
    ["friend", "amigo(a)"],
    ["from", "de (origem)"],
    ["nice to meet you", "prazer em conhecer-te"],
    ["and you?", "e tu?"],
    ["please", "por favor"],
  ],
  dialogue: [
    { who: "Ana", side: "left", en: "Hello! My name is Ana. What's your name?", pt: "Olá! Chamo-me Ana. Como te chamas?" },
    { who: "Carlos", side: "right", en: "Hi Ana! My name is Carlos.", pt: "Olá Ana! Chamo-me Carlos." },
    { who: "Ana", side: "left", en: "Nice to meet you, Carlos.", pt: "Prazer em conhecer-te, Carlos." },
    { who: "Carlos", side: "right", en: "Nice to meet you too. Where are you from?", pt: "Prazer também. De onde és?" },
    { who: "Ana", side: "left", en: "I am from Beira. And you?", pt: "Sou da Beira. E tu?" },
    { who: "Carlos", side: "right", en: "I am from Maputo.", pt: "Sou de Maputo." },
  ],
  dragSentences: [
    { before: "I", after: "from Maputo.", answer: "am" },
    { before: "She", after: "a teacher.", answer: "is" },
    { before: "We", after: "students.", answer: "are" },
    { before: "They", after: "from Beira.", answer: "are" },
    { before: "He", after: "my brother.", answer: "is" },
  ],
  speakingQuestions: [
    { en: "What is your name?", pt: "Qual é o teu nome?" },
    { en: "Where are you from?", pt: "De onde és?" },
    { en: "What is your job, or your dream job?", pt: "Qual é o teu trabalho, ou o trabalho dos teus sonhos?" },
  ],
};

const LEGACY_LESSONS = [
  { id: 2, title: "A Minha Família", subtitle: "Falar sobre a família e possessão", accent: ACCENTS[1],
    hookEn: "This is my family.", hookPt: "Esta é a minha família.",
    grammarTitle: "Possessivos + this / that",
    grammarPt: "Para dizer \"o meu\", \"o teu\", \"o dele\" em inglês, a palavra vem SEMPRE antes do substantivo: my brother, my sister.",
    pattern: [{ en: "my / your", pt: "meu / teu" }, { en: "his / her", pt: "dele / dela" }, { en: "our / their", pt: "nosso / deles" }, { en: "this (perto)", pt: "este / esta" }, { en: "those (longe)", pt: "aqueles / aquelas" }],
    examples: [{ en: "This is my mother.", pt: "Esta é a minha mãe." }, { en: "Those are my brothers.", pt: "Aqueles são os meus irmãos." }, { en: "Her name is Fátima.", pt: "O nome dela é Fátima." }],
    vocab: [["mother", "mãe"], ["father", "pai"], ["brother", "irmão"], ["sister", "irmã"], ["son", "filho"], ["daughter", "filha"], ["husband", "marido"], ["wife", "esposa"]],
    dialogue: [{ who: "A", en: "Is this your family?", pt: "Esta é a tua família?" }, { who: "B", en: "Yes, this is my mother and this is my father.", pt: "Sim, esta é a minha mãe e este é o meu pai." }, { who: "A", en: "And who is this?", pt: "E quem é esta?" }, { who: "B", en: "This is my sister, Lúcia. She is a nurse.", pt: "Esta é a minha irmã, Lúcia. Ela é enfermeira." }, { who: "A", en: "Nice! How many brothers do you have?", pt: "Que bom! Quantos irmãos tens?" }, { who: "B", en: "I have two brothers.", pt: "Tenho dois irmãos." }],
    quiz: [{ q: "\"___ is my mother\"", options: ["This", "These", "Those"], answer: "This" }, { q: "He is ___ brother.", options: ["I", "my", "me"], answer: "my" }, { q: "Plural de \"child\":", options: ["childs", "children", "childes"], answer: "children" }],
    speakingTask: "Descreve a tua família em voz alta usando 4 frases com \"my\"." },
  { id: 3, title: "O Meu Dia a Dia", subtitle: "Rotina diária e frequência", accent: ACCENTS[2],
    hookEn: "I wake up at six o'clock.", hookPt: "Eu acordo às seis horas.",
    grammarTitle: "Presente simples + advérbios de frequência",
    grammarPt: "Usamos o presente simples para hábitos. Na 3ª pessoa (he/she/it) o verbo ganha \"s\" — she works.",
    pattern: [{ en: "I/you/we/they + verb", pt: "sem s" }, { en: "he/she/it + verb-s", pt: "com s" }, { en: "always→usually→often", pt: "sempre→normalmente→frequentemente" }, { en: "sometimes→never", pt: "às vezes→nunca" }],
    examples: [{ en: "I usually work in the morning.", pt: "Eu normalmente trabalho de manhã." }, { en: "She always drinks tea.", pt: "Ela sempre bebe chá." }, { en: "They sometimes go to church.", pt: "Eles às vezes vão à igreja." }],
    vocab: [["wake up", "acordar"], ["go to work", "ir trabalhar"], ["have lunch", "almoçar"], ["study", "estudar"], ["cook", "cozinhar"], ["sleep", "dormir"], ["always", "sempre"], ["never", "nunca"]],
    dialogue: [{ who: "A", en: "What time do you wake up?", pt: "A que horas acordas?" }, { who: "B", en: "I wake up at six o'clock. And you?", pt: "Acordo às seis. E tu?" }, { who: "A", en: "I usually wake up at seven. Do you work in the morning?", pt: "Normalmente acordo às sete. Trabalhas de manhã?" }, { who: "B", en: "Yes, I work every morning. I have lunch at midday.", pt: "Sim, trabalho todas as manhãs. Almoço ao meio-dia." }, { who: "A", en: "What do you do in the evening?", pt: "O que fazes à noite?" }, { who: "B", en: "I usually study English in the evening.", pt: "Normalmente estudo inglês à noite." }],
    quiz: [{ q: "She ___ (work) every day.", options: ["work", "works", "working"], answer: "works" }, { q: "I ___ drink coffee at night.", options: ["always", "never"], answer: "never" }, { q: "What time ___ you wake up?", options: ["do", "does", "is"], answer: "do" }],
    speakingTask: "Conta em voz alta a tua rotina de hoje usando pelo menos 5 verbos no presente simples." },
  { id: 4, title: "O Que Estás a Fazer Agora?", subtitle: "Ações no momento presente", accent: ACCENTS[0],
    hookEn: "I am learning English right now!", hookPt: "Eu estou a aprender inglês agora!",
    grammarTitle: "Presente contínuo (am/is/are + -ing)",
    grammarPt: "Para ações NESTE momento: am/is/are + verbo-ing. \"I study\" (hábito) vs \"I am studying\" (agora).",
    pattern: [{ en: "I am doing", pt: "eu estou a fazer" }, { en: "she is cooking", pt: "ela está a cozinhar" }, { en: "they are not sleeping", pt: "eles não estão a dormir" }],
    examples: [{ en: "I am studying now.", pt: "Estou a estudar agora." }, { en: "She is cooking dinner.", pt: "Ela está a cozinhar o jantar." }, { en: "We are not sleeping.", pt: "Nós não estamos a dormir." }],
    vocab: [["right now", "agora mesmo"], ["at the moment", "neste momento"], ["cook", "cozinhar"], ["talk", "falar"], ["listen", "ouvir"], ["write", "escrever"], ["watch", "assistir"], ["play", "jogar"]],
    dialogue: [{ who: "A", en: "What are you doing right now?", pt: "O que estás a fazer agora?" }, { who: "B", en: "I am cooking dinner. What about you?", pt: "Estou a cozinhar o jantar. E tu?" }, { who: "A", en: "I am watching TV.", pt: "Estou a ver televisão." }, { who: "B", en: "Are you watching the news?", pt: "Estás a ver o telejornal?" }, { who: "A", en: "No, I am not. I am watching a film.", pt: "Não. Estou a ver um filme." }, { who: "B", en: "OK, talk to you later!", pt: "OK, falamos depois!" }],
    quiz: [{ q: "She ___ (cook) dinner right now.", options: ["cooks", "is cooking", "cook"], answer: "is cooking" }, { q: "They ___ not working today.", options: ["is", "am", "are"], answer: "are" }, { q: "\"Every day\" → simples; \"right now\" → ___.", options: ["simples", "contínuo"], answer: "contínuo" }],
    speakingTask: "Descreve em voz alta 3 coisas que estão a acontecer neste momento, usando \"is/are + -ing\"." },
  { id: 5, title: "Fazer Perguntas", subtitle: "Perguntas com do/does e wh-", accent: ACCENTS[1],
    hookEn: "Do you speak English?", hookPt: "Você fala inglês?",
    grammarTitle: "Perguntas: Do/Does + palavras wh-",
    grammarPt: "Sim/não: Do (I/you/we/they) ou Does (he/she/it). Perguntas abertas: wh- antes de do/does.",
    pattern: [{ en: "Do you...?", pt: "Tu...?" }, { en: "Does she...?", pt: "Ela...?" }, { en: "What do you...?", pt: "O que...?" }, { en: "Where does he...?", pt: "Onde...?" }],
    examples: [{ en: "Do you like tea?", pt: "Gostas de chá?" }, { en: "Does she work here?", pt: "Ela trabalha aqui?" }, { en: "Where do you live?", pt: "Onde é que vives?" }],
    vocab: [["like", "gostar"], ["live", "viver/morar"], ["work", "trabalhar"], ["speak", "falar"], ["understand", "entender"], ["question", "pergunta"], ["answer", "resposta"], ["because", "porque"]],
    dialogue: [{ who: "A", en: "Do you speak Portuguese?", pt: "Falas português?" }, { who: "B", en: "Yes, I do. Do you speak English?", pt: "Sim, falo. Tu falas inglês?" }, { who: "A", en: "A little. Where do you live?", pt: "Um pouco. Onde vives?" }, { who: "B", en: "I live in Nampula. Why do you ask?", pt: "Vivo em Nampula. Porque perguntas?" }, { who: "A", en: "I want to visit! What do you like about it?", pt: "Quero visitar! O que gostas lá?" }, { who: "B", en: "I like the beaches.", pt: "Gosto das praias." }],
    quiz: [{ q: "___ you like tea?", options: ["Do", "Does", "Is"], answer: "Do" }, { q: "___ does she work?", options: ["Where", "Is", "Do"], answer: "Where" }, { q: "Does he ___ (speak) English?", options: ["speaks", "speak", "speaking"], answer: "speak" }],
    speakingTask: "Pensa em 5 perguntas para um novo amigo e diz-as em voz alta." },
  { id: 6, title: "Números, Horas e Compromissos", subtitle: "There is / there are + horas", accent: ACCENTS[2],
    hookEn: "There is a meeting at three o'clock.", hookPt: "Há uma reunião às três horas.",
    grammarTitle: "There is / There are",
    grammarPt: "\"There is\" com uma coisa; \"there are\" com várias. Para horas: \"it's\" + a hora.",
    pattern: [{ en: "There is a...", pt: "Há um/uma..." }, { en: "There are some...", pt: "Há alguns..." }, { en: "It's ... o'clock", pt: "São ... horas" }, { en: "half past / quarter to", pt: "e meia / menos um quarto" }],
    examples: [{ en: "There is a book on the table.", pt: "Há um livro na mesa." }, { en: "There are three students.", pt: "Há três estudantes." }, { en: "It's half past two.", pt: "São duas e meia." }],
    vocab: [["one→twenty", "um→vinte"], ["o'clock", "em ponto"], ["half past", "e meia"], ["quarter to", "menos um quarto"], ["meeting", "reunião"], ["appointment", "compromisso"], ["tomorrow", "amanhã"], ["today", "hoje"]],
    dialogue: [{ who: "A", en: "What time is the meeting?", pt: "A que horas é a reunião?" }, { who: "B", en: "There is a meeting at three o'clock.", pt: "Há uma reunião às três horas." }, { who: "A", en: "Is there another meeting today?", pt: "Há outra reunião hoje?" }, { who: "B", en: "Yes, there are two meetings today.", pt: "Sim, há duas reuniões hoje." }, { who: "A", en: "OK, see you at three!", pt: "OK, vemo-nos às três!" }, { who: "B", en: "See you later!", pt: "Até já!" }],
    quiz: [{ q: "___ a book on the table.", options: ["There is", "There are"], answer: "There is" }, { q: "___ three students in the class.", options: ["There is", "There are"], answer: "There are" }, { q: "3:30 por extenso:", options: ["half past three", "quarter to three"], answer: "half past three" }],
    speakingTask: "Diz em voz alta 3 frases com \"there is / there are\" e depois que horas são agora." },
];

const ALL_LESSONS = [
  { id: 1, title: LESSON1.title, subtitle: LESSON1.subtitle, accent: LESSON1.accent },
  ...LEGACY_LESSONS.map((l) => ({ id: l.id, title: l.title, subtitle: l.subtitle, accent: l.accent })),
];

export { ACCENTS, speak, SoundBars, LESSON1, LEGACY_LESSONS, ALL_LESSONS };
