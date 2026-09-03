// Toda a estrutura do curso vive aqui, em ficheiros simples.
// Para adicionar uma lição nova: acrescenta um objeto ao array "lessons" do módulo certo.

export const modules = [
  {
    slug: "modulo-1",
    number: 1,
    title: "Primeiros Passos",
    description: "Cumprimentar, apontar objetos e nomear o que te rodeia.",
    lessons: [
      {
        slug: "greetings-and-introductions",
        number: 1,
        title: "Greetings & Introductions",
        subtitle: "Cumprimentos e Apresentações",
        canDo: "No final desta lição, consegues cumprimentar alguém, apresentar-te (nome, origem, profissão) e reagir a uma apresentação, em situações formais e informais.",
        content: true, // esta lição já tem conteúdo completo abaixo
      },
      {
        slug: "demonstratives-and-plurals",
        number: 2,
        title: "This, That & Plurals",
        subtitle: "Demonstrativos e Plural dos Substantivos",
        canDo: "Consegues apontar e nomear objetos perto e longe de ti, no singular e no plural.",
        content: false,
      },
      {
        slug: "personal-pronouns-and-to-be",
        number: 3,
        title: "Personal Pronouns & Verb To Be",
        subtitle: "Pronomes Pessoais e Verbo To Be",
        canDo: "Consegues descrever-te a ti e a outras pessoas usando I am / you are / he is, etc.",
        content: false,
      },
      {
        slug: "there-is-there-are-articles",
        number: 4,
        title: "There is / There are & Articles",
        subtitle: "Há... e Artigos",
        canDo: "Consegues descrever o que existe numa sala ou lugar.",
        content: false,
      },
    ],
  },
  {
    slug: "modulo-2",
    number: 2,
    title: "Números, Informação Pessoal e Família",
    description: "Números, horas e a tua família.",
    lessons: [],
  },
  {
    slug: "modulo-3",
    number: 3,
    title: "Rotina Diária e Horas",
    description: "O teu dia, hora a hora.",
    lessons: [],
  },
  {
    slug: "modulo-4",
    number: 4,
    title: "Na Cidade: Lugares e Direções",
    description: "Perguntar e dar direções.",
    lessons: [],
  },
  {
    slug: "modulo-5",
    number: 5,
    title: "Comida e Compras no Mercado",
    description: "Pedir, comprar, negociar.",
    lessons: [],
  },
  {
    slug: "modulo-6",
    number: 6,
    title: "Descrevendo Pessoas, Objetos e o Mundo",
    description: "Adjetivos e descrições completas.",
    lessons: [],
  },
];

export function findModule(slug) {
  return modules.find((m) => m.slug === slug);
}

export function findLesson(moduleSlug, lessonSlug) {
  const mod = findModule(moduleSlug);
  if (!mod) return null;
  const lesson = mod.lessons.find((l) => l.slug === lessonSlug);
  return lesson ? { module: mod, lesson } : null;
}
