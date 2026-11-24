/* Conteúdo do app (mock do protótipo). Fica separado das telas para que a
   busca global, as páginas e o menu usem exatamente os mesmos dados. */

export interface Book {
  id: string;
  title: string;
  desc: string;
  /** cor de fundo da capa / fallback da prateleira */
  bg: string;
  cover?: string;
  /** cor do título na capa */
  fg: string;
  panel: string;
  infantil?: boolean;
  autora?: string;
  link?: string;
}

export const BOOKS: Book[] = [
  {
    id: 'pequeno-manual',
    title: 'Pequeno manual',
    desc: 'Feito pela Câmara dos Deputados, explica de forma acessível a Lei Maria da Penha, o ciclo da violência e os mecanismos de proteção.',
    bg: '#e8742a',
    cover: '/assets/pequeno-manual.png',
    fg: '#ffffff',
    panel: '#796aaa',
  },
  {
    id: 'feminismo-para-todo-mundo',
    title: 'O feminismo é para todo mundo',
    desc: 'Define o feminismo como o movimento para acabar com o sexismo, sem ser anti-homem.',
    bg: '#f2c94c',
    cover: '/assets/o-feminismo-e-para-todos.jpg',
    fg: '#3a1a4a',
    panel: '#796aaa',
  },
  {
    id: 'malala',
    title: 'Malala',
    desc: 'Mostra o drama, a luta e a representatividade de uma garota impedida de estudar.',
    bg: '#b5533f',
    cover: '/assets/malala.jpg',
    fg: '#fff3d6',
    panel: '#796aaa',
    infantil: true,
  },
  {
    id: 'coisa-de-menina',
    title: 'Coisa de menina',
    desc: 'Um livro infantil que combate estereótipos de gênero.',
    bg: '#f0d9a8',
    cover: '/assets/coisa-de-menina.jpg',
    fg: '#44175a',
    panel: '#6c8c7d',
    infantil: true,
  },
  {
    id: 'coisa-de-menino',
    title: 'Coisa de menino',
    desc: 'Pri Ferrari defende a liberdade dos meninos de expressar emoções.',
    bg: '#9fd3c7',
    cover: '/assets/coisa-de-menino.jpg',
    fg: '#22403a',
    panel: '#6c8c7d',
    infantil: true,
  },
  {
    id: 'mulheres-que-correm-com-os-lobos',
    title: 'Mulheres que correm com os lobos',
    desc: 'Investiga o arquétipo da "Mulher Selvagem" na natureza feminina.',
    bg: '#6e3a1f',
    cover: '/assets/mulheres-que-correm-com-os-lobos.webp',
    fg: '#f0edda',
    panel: '#6c8c7d',
  },
  {
    id: 'meninos-sao-a-cura',
    title: 'Os meninos são a cura',
    desc: 'Uma educação feminista e amorosa é a chave para erradicar o machismo estrutural.',
    bg: '#2f4b7c',
    cover: '/assets/os-meninos-sao-a-cura.jpg',
    fg: '#ffe9a8',
    panel: '#796aaa',
  },
  {
    id: 'justica-para-todas',
    title: 'Justiça para todas',
    desc: 'Elucida o histórico de misoginia e orienta sobre denúncias e redes de apoio.',
    bg: '#c94f6d',
    cover: '/assets/justica-para-todas.jpg',
    fg: '#ffffff',
    panel: '#796aaa',
  },
  {
    id: 'pipo-e-fifi',
    title: 'Pipo e Fifi',
    desc: 'Ensina proteção contra a violência sexual para crianças a partir de 3 anos.',
    bg: '#1f7a72',
    cover: '/assets/pipo-e-fifi.jpg',
    fg: '#f7e04b',
    panel: '#796aaa',
    infantil: true,
  },
];

export interface Article {
  id: string;
  source: string;
  title: string;
  tint: string;
  image?: string;
}

export const ARTICLES: Article[] = [
  {
    id: 'sao-francisco-do-conde',
    source: 'saofranciscoconde',
    title:
      'Capacitação fortalece rede de atendimento e enfrentamento à violência contra a mulher em São Francisco do Conde',
    tint: '#c99aa6',
    image: '/assets/mato-grosso.jpg',
  },
  {
    id: 'mato-grosso-do-sul',
    source: 'Prefeitura de matogrosso',
    title: 'Mato Grosso do Sul leva programa Protege à ONU e debate proteção de mulheres em fórum internacional',
    tint: '#9aa8c9',
    image: '/assets/mato-grosso.jpg',
  },
  {
    id: 'agencia-senado',
    source: 'Senado noticias',
    title: 'Prazo para denúncia de violência doméstica agora é de 12 meses — Fonte: Agência Senado',
    tint: '#a8c99a',
    image: '/assets/prazo-denuncia.jpg',
  },
];

export interface TimelinePost {
  id: string;
  author: string;
  kind: 'quote' | 'text';
  quote?: string;
  text?: string;
  caption?: string;
}

export const TIMELINE_POSTS: TimelinePost[] = [
  {
    id: 'tl-1',
    author: 'Elpida Protegida',
    kind: 'quote',
    quote: 'permita-se ser iniciante, ninguém começa sendo CEO',
    caption: 'Todo mundo começa de algum lugar, o importante é começar!',
  },
  {
    id: 'tl-2',
    author: 'Rede de Apoio',
    kind: 'text',
    text: 'O lar deveria ser um lugar seguro, mas para muitas mulheres não é. Precisamos agir agora para mudar esse cenário! É dever de todos lutar contra o feminicídio e a violência de gênero!',
  },
  {
    id: 'tl-3',
    author: 'Elpida Protegida',
    kind: 'text',
    text: 'Você não está sozinha. A Central de Atendimento à Mulher (Ligue 180) é gratuita e funciona todos os dias, 24 horas. Em caso de risco imediato, ligue 190.',
  },
];

export interface CyclePhase {
  id: string;
  label: string;
  title: string;
  paragraphs: string[];
}

export const CYCLE_PHASES: CyclePhase[] = [
  {
    id: 'fase-1',
    label: 'FASE 1',
    title: 'AUMENTO DA TENSÃO',
    paragraphs: [
      'Nesse momento o agressor fica tenso e irritado por motivos insignificantes, podendo ter acessos de raiva. Ele também humilha, ameaça e destrói objetos.',
      'A mulher tenta acalmar o agressor, fica aflita e evita qualquer conduta que possa "provocá-lo". As sensações são muitas: tristeza, angústia, ansiedade, medo e desilusão.',
      'Em geral, a vítima tende a negar que isso está acontecendo com ela, esconde os sinais das demais pessoas e, muitas vezes, acha que fez algo errado para justificar o comportamento violento. Essa tensão pode durar dias ou anos, mas costuma aumentar e é muito provável que leve à Fase 2.',
    ],
  },
  {
    id: 'fase-2',
    label: 'FASE 2',
    title: 'ATO DE VIOLÊNCIA',
    paragraphs: [
      'Esta fase corresponde à explosão do agressor, ou seja, à falta de controle sobre os próprios atos. Toda a tensão acumulada na Fase 1 se transforma em violência verbal, física, psicológica, moral ou patrimonial.',
      'Mesmo tendo consciência de que o agressor está fora de controle e tem um poder destrutivo grande sobre a sua vida, a mulher sofre uma tensão psicológica severa: insônia, perda de peso, fadiga constante, ansiedade e medo.',
      'Nesses momentos, ela também pode tomar decisões — as mais comuns são buscar ajuda, denunciar, esconder-se na casa de amigos ou parentes, pedir a separação e, até mesmo, suicidar-se. Há um distanciamento do agressor.',
    ],
  },
  {
    id: 'fase-3',
    label: 'FASE 3',
    title: 'ARREPENDIMENTO E COMPORTAMENTO CARINHOSO',
    paragraphs: [
      'Terminada a violência, o agressor demonstra arrependimento, promete mudar e passa a ter um comportamento carinhoso, o que é conhecido como "lua de mel".',
      'A mulher, que estava aflita e com medo, sente alívio e volta a ter esperança. Essa fase costuma fazer com que ela desista de denunciar ou retome a relação.',
      'Com o tempo, a tensão volta e o ciclo recomeça — e, quanto mais ele se repete, mais as violências tendem a ficar frequentes e graves. Se você se identificou, veja "Como pedir ajuda?".',
    ],
  },
];

export interface InfoSection {
  title: string;
  items: string[];
}

export interface InfoPageData {
  slug: string;
  title: string;
  intro: string;
  sections: InfoSection[];
}

export const INFO_PAGES: InfoPageData[] = [
  {
    slug: 'como-pedir-ajuda',
    title: 'Como pedir ajuda?',
    intro: 'Você não precisa enfrentar isso sozinha. Estes são os canais oficiais de atendimento no Brasil.',
    sections: [
      {
        title: 'Telefones',
        items: [
          'Ligue 180 — Central de Atendimento à Mulher (gratuita, 24 horas).',
          'Ligue 190 — Polícia Militar, em caso de risco imediato.',
          'Ligue 192 — SAMU, para atendimento médico de urgência.',
          'Ligue 193 — Corpo de Bombeiros.',
          'Disque 100 — Disque Direitos Humanos.',
        ],
      },
      {
        title: 'Presencialmente',
        items: [
          'Procure a Delegacia da Mulher (DEAM) mais próxima — use a aba Mapa do app.',
          'Se não houver uma delegacia especializada, qualquer delegacia de polícia deve registrar a ocorrência.',
          'Hospitais atendem lesões e podem acionar a rede de proteção.',
        ],
      },
      {
        title: 'Ao pedir ajuda',
        items: [
          'Diga onde você está e se há crianças ou outras pessoas em risco.',
          'Se puder, guarde prints, fotos, áudios e laudos — podem servir como prova.',
          'Você pode pedir medidas protetivas de urgência com base na Lei Maria da Penha.',
        ],
      },
    ],
  },
  {
    slug: 'como-se-proteger',
    title: 'Como se proteger?',
    intro: 'Algumas medidas de segurança podem ajudar a reduzir riscos enquanto você busca apoio.',
    sections: [
      {
        title: 'Prepare-se',
        items: [
          'Combine com uma pessoa de confiança um código para pedir ajuda.',
          'Cadastre seus guardiões no app para receberem seu aviso em situações de risco.',
          'Mantenha o celular carregado e o número de emergência à mão.',
          'Deixe documentos, chaves e dinheiro em um lugar de fácil acesso.',
        ],
      },
      {
        title: 'Durante uma crise',
        items: [
          'Evite cômodos sem saída ou com objetos que possam ser usados como arma, como a cozinha.',
          'Se puder sair, vá para um lugar com pessoas e ligue 190.',
          'Priorize a sua segurança e a das crianças, não os bens materiais.',
        ],
      },
      {
        title: 'Depois',
        items: [
          'Registre a ocorrência e solicite medidas protetivas de urgência.',
          'Procure atendimento médico e psicológico na rede pública.',
          'Converse com alguém de confiança sobre o que aconteceu.',
        ],
      },
    ],
  },
];
