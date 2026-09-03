// Aula 1, Módulo 1 — Greetings and Introductions
// Conteúdo reescrito para seguir o Guia de Melhoria à risca: apenas as 4
// estruturas-alvo (Hello / My name is... / I am from... / Nice to meet you),
// mais 3 variações só para reconhecimento (Hi / I'm... / Nice to meet you too).

export const lesson1 = {
  // ---- Alvo mínimo (secção 3) --------------------------------------------
  targetSentences: [
    { en: "Hello.", pt: "Olá." },
    { en: "My name is Ana.", pt: "O meu nome é Ana." },
    { en: "I am from Mozambique.", pt: "Eu sou de Moçambique." },
    { en: "Nice to meet you.", pt: "Prazer em conhecer-te." },
  ],
  recognitionVariants: [
    { en: "Hi.", pt: "Oi." },
    { en: "I'm Ana.", pt: "Sou a Ana." },
    { en: "Nice to meet you too.", pt: "Igualmente." },
  ],

  // ---- 4. Warm-up / Context ----------------------------------------------
  warmupDialogue: [
    { who: "A", en: "Hello. My name is Ana.", pt: "Olá. O meu nome é Ana." },
    { who: "B", en: "Hello. My name is John.", pt: "Olá. O meu nome é John." },
    { who: "A", en: "I am from Mozambique.", pt: "Eu sou de Moçambique." },
    { who: "B", en: "Nice to meet you.", pt: "Prazer em conhecer-te." },
    { who: "A", en: "Nice to meet you too.", pt: "Igualmente." },
  ],
  warmupCheck: [
    { q: "Quem se está a conhecer pela primeira vez?", options: ["Ana e John", "Só a Ana", "Só o John"], answer: 0 },
    { q: "Qual é o nome da primeira pessoa a falar?", options: ["John", "Ana", "Zara"], answer: 1 },
    { q: "De onde é a Ana?", options: ["Portugal", "Brasil", "Mozambique"], answer: 2 },
    { q: "Qual frase mostra simpatia ao conhecer alguém?", options: ["Hello.", "Nice to meet you.", "My name is Ana."], answer: 1 },
  ],

  // ---- 5. Language Discovery ----------------------------------------------
  targetMatch: [
    { en: "Hello.", pt: "Olá." },
    { en: "My name is Ana.", pt: "O meu nome é Ana." },
    { en: "I am from Mozambique.", pt: "Eu sou de Moçambique." },
    { en: "Nice to meet you.", pt: "Prazer em conhecer-te." },
  ],

  // ---- 6. Listening --------------------------------------------------------
  listeningName: { audio: "My name is Ana.", q: "Qual é o nome?", options: ["Ana", "John", "Zara"], answer: 0 },
  listeningCountry: { audio: "I am from Mozambique.", q: "Qual é o país?", options: ["Portugal", "Mozambique", "Brazil"], answer: 1 },
  listeningMeaning: { audio: "Nice to meet you.", q: "O que significa esta frase?", options: ["Prazer em conhecer-te.", "Adeus.", "Como estás?"], answer: 0 },
  listeningOrder: {
    audio: "Hello. My name is Ana. I am from Mozambique. Nice to meet you.",
    words: ["Hello.", "My name is Ana.", "I am from Mozambique.", "Nice to meet you."],
    correctOrder: ["Hello.", "My name is Ana.", "I am from Mozambique.", "Nice to meet you."],
    translation: "Ordena a apresentação pela ordem em que a ouviste.",
  },
  listeningQA: {
    audio: "Hello. My name is Fátima. I am from Mozambique. Nice to meet you.",
    questions: [
      { q: "What is her name?", options: ["Ana", "Fátima", "Zara"], answer: 1 },
      { q: "Where is she from?", options: ["Portugal", "Brazil", "Mozambique"], answer: 2 },
    ],
  },

  // ---- 7. Recognition --------------------------------------------------------
  recognition: [
    { audioText: "Hello.", q: "Qual destas frases é um cumprimento (Hello)?", options: ["Hello.", "Goodbye.", "Nice to meet you."], answer: 0 },
    { q: "Qual frase diz o nome de alguém?", options: ["I am from Mozambique.", "My name is Ana.", "Nice to meet you."], answer: 1 },
    { q: "Qual frase diz de onde alguém é?", options: ["My name is Ana.", "Nice to meet you.", "I am from Mozambique."], answer: 2 },
    { q: "Qual frase usamos, com simpatia, ao conhecer alguém?", options: ["Goodbye.", "Nice to meet you.", "My name is Ana."], answer: 1 },
  ],
  recognitionMatch: [
    { en: "Hello.", pt: "Ao cumprimentar alguém" },
    { en: "My name is Ana.", pt: "Ao dizer o teu nome" },
    { en: "I am from Mozambique.", pt: "Ao dizer de onde és" },
    { en: "Nice to meet you.", pt: "Ao conhecer alguém, com simpatia" },
  ],

  // ---- 8. Controlled Practice --------------------------------------------
  practiceNameFill: { prompt: "My name is _____.", placeholder: "Escreve o teu nome" },
  practiceFromFill: { prompt: "I am from _____.", placeholder: "Mozambique", expected: "Mozambique" },
  practiceReorder1: { words: ["name", "My", "is", "Ana"], correctOrder: ["My", "name", "is", "Ana"], translation: "O meu nome é Ana." },
  practiceReorder2: { words: ["from", "I", "am", "Mozambique"], correctOrder: ["I", "am", "from", "Mozambique"], translation: "Eu sou de Moçambique." },
  practiceMC: { q: "Nice to meet you.", options: ["Goodbye.", "Nice to meet you too.", "My name is."], answer: 1 },

  // ---- 9. Pronunciation --------------------------------------------------
  pronunciationTargets: [
    "Hello.",
    "My name is Ana.",
    "I am from Mozambique.",
    "Nice to meet you.",
  ],

  // ---- 10. Speaking --------------------------------------------------------
  speakingSteps: [
    { instruction: "Diz: Hello.", prompt: "Hello." },
    { instruction: "Completa e diz o teu nome.", prompt: "My name is ____." },
    { instruction: "Completa e diz o teu país.", prompt: "I am from ____." },
    { instruction: "Diz: Nice to meet you.", prompt: "Nice to meet you." },
  ],
  speakingFinal: {
    instruction: "Introduce yourself.",
    prompt: "Apresenta-te sem olhar para o modelo.",
  },

  // ---- 11. Writing --------------------------------------------------------
  writingName: { prompt: "Hello. My name is _____.", placeholder: "O teu nome" },
  writingCountry: { prompt: "I am from _____.", placeholder: "Mozambique", expected: "Mozambique" },
  writingReorder: { words: ["you", "to", "meet", "Nice"], correctOrder: ["Nice", "to", "meet", "you"], translation: "Prazer em conhecer-te." },
  writingCorrect: {
    instruction: "Corrige a frase:",
    wrong: "Name my is Ana.",
    expected: "My name is Ana.",
  },
  writingFull: {
    instruction: "Escreve a tua apresentação completa.",
    model: "Hello. My name is ____. I am from ____. Nice to meet you.",
  },

  // ---- 12. Conversation Simulation ----------------------------------------
  conversation: [
    { speaker: "them", en: "Hello!", pt: "Olá!" },
    { speaker: "you", expected: ["hello", "hi"], hintEn: "Hello.", hintPt: "Responde: Olá." },
    { speaker: "them", en: "What's your name?", pt: "Como te chamas?" },
    { speaker: "you", expected: ["my name is", "i'm", "i am"], hintEn: "My name is ____.", hintPt: "Diz o teu nome." },
    { speaker: "them", en: "Where are you from?", pt: "De onde és?" },
    { speaker: "you", expected: ["i am from", "i'm from"], hintEn: "I am from ____.", hintPt: "Diz de onde és." },
    { speaker: "them", en: "Nice to meet you.", pt: "Prazer em conhecer-te." },
    { speaker: "you", expected: ["nice to meet you too", "nice to meet you"], hintEn: "Nice to meet you too.", hintPt: "Responde com simpatia." },
  ],

  // ---- 13. Real-life Challenge --------------------------------------------
  challenge: {
    instruction: "Esta semana, apresenta-te em inglês a uma pessoa real — um colega, um cliente, ou em voz alta ao espelho.",
    example: { en: "Hi! I'm Sarah. What's your name?", pt: "Oi! Sou a Sarah. Como te chamas?" },
    prompt: "Hello. My name is ____. I am from ____. Nice to meet you.",
  },

  // ---- 14. Final Assessment ------------------------------------------------
  assessmentListening: [
    { audio: "Hello.", q: "O que ouviste?", options: ["Hello.", "Goodbye.", "Thank you."], answer: 0 },
    { audio: "My name is John.", q: "Qual é o nome?", options: ["Ana", "John", "Zara"], answer: 1 },
    { audio: "I am from Mozambique.", q: "Qual é o país?", options: ["Mozambique", "Brazil", "Portugal"], answer: 0 },
    { audio: "Nice to meet you.", q: "O que significa esta frase?", options: ["Adeus.", "Prazer em conhecer-te.", "Como estás?"], answer: 1 },
    { audio: "Hello. My name is Zara.", q: "Qual é o nome da pessoa?", options: ["Zara", "Ana", "John"], answer: 0 },
  ],
  assessmentVocab: [
    { q: "Como cumprimentas alguém?", options: ["Hello.", "Nice to meet you.", "I am from..."], answer: 0 },
    { q: "Como dizes o teu nome?", options: ["I am from...", "My name is...", "Hello."], answer: 1 },
    { q: "Como dizes de onde és?", options: ["My name is...", "I am from...", "Nice to meet you."], answer: 1 },
    { q: "Como reages com simpatia ao conhecer alguém?", options: ["Goodbye.", "Nice to meet you.", "My name is..."], answer: 1 },
    { q: "\"Mozambique\" é...", options: ["um nome", "um país", "uma saudação"], answer: 1 },
  ],
  assessmentSentences: [
    { words: ["name", "My", "is", "John"], correctOrder: ["My", "name", "is", "John"], translation: "O meu nome é John." },
    { words: ["from", "I", "am", "Mozambique"], correctOrder: ["I", "am", "from", "Mozambique"], translation: "Eu sou de Moçambique." },
    { words: ["meet", "Nice", "you", "to"], correctOrder: ["Nice", "to", "meet", "you"], translation: "Prazer em conhecer-te." },
    { words: ["is", "name", "My", "Zara"], correctOrder: ["My", "name", "is", "Zara"], translation: "O meu nome é Zara." },
    { words: ["Mozambique", "from", "I'm"], correctOrder: ["I'm", "from", "Mozambique"], translation: "Sou de Moçambique." },
  ],
  assessmentSpeaking: {
    instruction: "Introduce yourself.",
    prompt: "Diz a tua apresentação completa, sem olhar para o modelo.",
  },
  assessmentConversation: [
    { speaker: "them", en: "Hi! What's your name?", pt: "Oi! Como te chamas?" },
    { speaker: "you", expected: ["my name is", "i'm", "i am"], hintEn: "My name is ____.", hintPt: "Diz o teu nome." },
    { speaker: "them", en: "Where are you from?", pt: "De onde és?" },
    { speaker: "you", expected: ["i am from", "i'm from"], hintEn: "I am from ____.", hintPt: "Diz de onde és." },
  ],
};
