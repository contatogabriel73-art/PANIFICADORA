/* =============================================================================
   MAISON DOURADA — ARQUIVO ÚNICO DE CONFIGURAÇÃO DA MARCA
   -----------------------------------------------------------------------------
   Tudo o que identifica o negócio mora aqui: nome, logo, cores, fontes, textos,
   preços, horários, telefone, Instagram, endereço, eventos e fotos.
   Para adaptar o site a outro cliente, edite SÓ este arquivo (e troque os
   arquivos de mídia em /assets). Nenhum outro arquivo precisa ser alterado.

   Dicas rápidas:
   - Preços podem ser número (64.9 → "R$ 64,90") ou texto livre ("sob consulta").
   - Imagens: deixe `src: ""` para mostrar um placeholder elegante. Para trocar,
     coloque o caminho da foto, ex.: src: "assets/img/galeria-01.jpg".
   - Horários usam o formato "HH:MM" (24h). Dias da semana: 0 = domingo … 6 = sábado.
   - Depois de editar, rode `node tools/sync-meta.mjs` para atualizar as
     tags de SEO/Open Graph estáticas do index.html (opcional, ver README).

   ⚠ Projeto de portfólio: TODOS os dados abaixo são fictícios/provisórios.
   ============================================================================= */

window.SITE_CONFIG = {
  /* ---------------------------------------------------------------- Marca -- */
  marca: {
    nome: "Maison Dourada",
    complemento: "Padaria e Café",           // aparece abaixo do nome no logo
    nomeCompleto: "Maison Dourada Padaria e Café",
    fundacao: 1991,
    logo: {
      imagem: "assets/img/logo.svg",          // ícone/monograma (SVG ou PNG)
      alt: "Maison Dourada Padaria e Café",
      mostrarNome: true                       // false se o logo já contém o nome escrito
    },
    favicon: "assets/img/favicon.svg",
    demo: true                                // mostra aviso de "projeto demonstrativo" no rodapé
  },

  /* -------------------------------------------------------------- Contato -- */
  contato: {
    whatsapp: "5547999990000",                // só números: 55 + DDD + número
    whatsappExibicao: "(47) 99999-0000",
    email: "ola@maisondourada.com.br",
    instagram: "maisondourada.cafe",          // sem o @
    mensagemPadraoWhatsapp: "Olá, Maison Dourada! Gostaria de mais informações."
  },

  endereco: {
    rua: "Rua das Palmeiras, 1991",
    bairro: "Centro",
    cidade: "Joinville",
    uf: "SC",
    cep: "89201-000",
    referencia: "Em frente à praça, com estacionamento conveniado",
    // Opcional: link exato do Google Maps. Se vazio, é montado a partir do endereço.
    mapsUrl: ""
  },

  /* ------------------------------------------------------------------ SEO -- */
  seo: {
    titulo: "Maison Dourada Padaria e Café · Buffet de café em Joinville/SC",
    descricao: "Padaria artesanal e café em Joinville/SC desde 1991. Buffet de café com pães, cucas, bolos e café especial. Reserve sua mesa pelo WhatsApp.",
    url: "https://maisondourada.example.com/", // domínio final do site
    imagemOg: "assets/img/og-image.jpg",       // 1200×630
    idioma: "pt-BR",
    fusoHorario: "America/Sao_Paulo",          // usado no selo "Aberto agora"
    faixaDePreco: "$$"
  },

  /* ---------------------------------------------------------- Tema visual -- */
  // Sobrescrevem as variáveis CSS do topo de assets/css/styles.css.
  tema: {
    cores: {
      preto: "#0E0D0C",
      dourado: "#B8924A",
      douradoClaro: "#D4B26A",
      douradoEscuro: "#7A5C26",   // dourado para TEXTO sobre fundo claro (contraste AA)
      creme: "#F6F0E4",
      cremeEscuro: "#ECE2CF",
      cafe: "#3A2A1E"
    },
    fontes: {
      titulo: "'Cormorant Garamond', 'Times New Roman', serif",
      texto: "'Jost', system-ui, -apple-system, 'Segoe UI', sans-serif",
      manuscrita: "'Pinyon Script', 'Brush Script MT', cursive",
      googleFontsUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@300;400;500&family=Pinyon+Script&display=swap"
    }
  },

  /* ----------------------------------------------------------------- Menu -- */
  menu: [
    { rotulo: "Buffet", alvo: "buffet" },
    { rotulo: "Cardápio", alvo: "cardapio" },
    { rotulo: "Eventos", alvo: "eventos" },
    { rotulo: "História", alvo: "historia" },
    { rotulo: "Galeria", alvo: "galeria" },
    { rotulo: "Horários", alvo: "horarios" },
    { rotulo: "Encomendas", alvo: "encomendas" }
  ],
  botaoMenu: { rotulo: "Reservar mesa", alvo: "reserva" },

  /* ----------------------------------------------------------------- Hero -- */
  hero: {
    sobretitulo: "Joinville · desde 1991",
    titulo: "Café, pão e tradição num só lugar",
    subtitulo: "Um buffet de café sem pressa, com pães de fermentação natural, cucas da casa e café especial servido à mesa.",
    video: "assets/video/hero.mp4",     // MP4 H.264, mudo, até ~5 MB
    poster: "assets/img/hero-poster.jpg", // imagem exibida enquanto carrega ou se o vídeo falhar
    botoes: [
      { rotulo: "Reservar mesa", alvo: "reserva", estilo: "primario" },
      { rotulo: "Ver buffet", alvo: "buffet", estilo: "secundario" }
    ]
  },

  /* --------------------------------------------------------------- Buffet -- */
  buffet: {
    sobretitulo: "Buffet de café",
    titulo: "A mesa posta, do jeito que a avó fazia",
    texto: "Serviço à vontade, reposto o tempo todo. Você escolhe a mesa, nós cuidamos do resto.",
    itens: [
      { icone: "trigo", nome: "Pães artesanais", descricao: "Fermentação natural, centeio, brioche e pão de milho." },
      { icone: "frios", nome: "Frios e queijos", descricao: "Presunto cru, salame colonial e queijos da serra." },
      { icone: "bolo", nome: "Bolos caseiros", descricao: "Fubá, laranja, chocolate e o bolo do dia." },
      { icone: "cuca", nome: "Cucas da casa", descricao: "Banana, uva, farofa e requeijão — receita de família." },
      { icone: "cafe", nome: "Café especial", descricao: "Grãos selecionados, espresso e coado à mesa." },
      { icone: "suco", nome: "Sucos naturais", descricao: "Laranja, uva integral e o suco da estação." }
    ],
    preco: {
      valor: 64.9,
      rotulo: "por pessoa",
      observacao: "Crianças de 6 a 10 anos pagam meia. Até 5 anos não pagam."
    },
    tituloHorarios: "Dias e horários",
    grupoHorario: "buffet",   // usa a tabela "buffet" da seção Horários (fonte única)
    cta: { rotulo: "Reservar mesa", alvo: "reserva" }
  },

  /* ------------------------------------------------------------- Cardápio -- */
  cardapio: {
    sobretitulo: "Carta de cafés",
    titulo: "Para pedir à parte",
    texto: "Grãos especiais do Sul de Minas e da Mantiqueira, torrados em pequenos lotes.",
    colunas: [
      {
        titulo: "Bebidas quentes",
        icone: "cafe",
        itens: [
          { nome: "Espresso", descricao: "Curto, encorpado, crema dourada", preco: 7 },
          { nome: "Espresso duplo", descricao: "Duas doses, mesma delicadeza", preco: 10 },
          { nome: "Cappuccino da casa", descricao: "Com canela e cacau, como antigamente", preco: 14 },
          { nome: "Latte", descricao: "Leite vaporizado e espresso suave", preco: 13 },
          { nome: "Mocha", descricao: "Espresso com chocolate belga", preco: 16 },
          { nome: "Coado no V60", descricao: "Grão do mês, servido na mesa", preco: 15 },
          { nome: "Chocolate quente", descricao: "Cremoso, com chantilly da casa", preco: 16 },
          { nome: "Chá de ervas da serra", descricao: "Cidreira, hortelã e capim-limão", preco: 9 }
        ]
      },
      {
        titulo: "Bebidas geladas",
        icone: "gelado",
        itens: [
          { nome: "Cold brew", descricao: "Extração a frio por 18 horas", preco: 15 },
          { nome: "Iced latte", descricao: "Espresso, leite e gelo", preco: 15 },
          { nome: "Café gelado com creme", descricao: "Doce na medida, com nata batida", preco: 16 },
          { nome: "Affogato", descricao: "Sorvete de baunilha e espresso quente", preco: 18 },
          { nome: "Frappé de caramelo", descricao: "Caramelo salgado feito aqui", preco: 19 },
          { nome: "Soda italiana", descricao: "Frutas vermelhas ou maçã verde", preco: 14 },
          { nome: "Suco de laranja", descricao: "Espremido na hora, 400 ml", preco: 11 },
          { nome: "Limonada suíça", descricao: "Com leite condensado", preco: 13 }
        ]
      }
    ],
    nota: "Preços provisórios em reais. Leite vegetal sem custo adicional."
  },

  /* -------------------------------------------------------------- Reserva -- */
  reserva: {
    sobretitulo: "Reserva de mesa",
    titulo: "Guardamos o seu lugar",
    texto: "Preencha os dados e enviaremos o pedido direto para o nosso WhatsApp. A confirmação chega em poucos minutos, no horário de atendimento.",
    destaques: [
      { icone: "relogio", texto: "Tolerância de 15 minutos" },
      { icone: "pessoas", texto: "Grupos acima de 12 pessoas: fale conosco" },
      { icone: "presente", texto: "Aniversário? Avise nas observações" }
    ],
    manuscrita: "Esperamos por você",
    grupoHorario: "buffet",     // horários disponíveis = horários do buffet
    intervaloMinutos: 30,       // de quanto em quanto tempo há horário de reserva
    ultimaReservaAntes: 60,     // última reserva X minutos antes de fechar
    antecedenciaMinimaDias: 0,  // 0 = permite reservar para hoje
    maxPessoas: 12,
    botao: "Enviar pelo WhatsApp",
    mensagemIntro: "Olá, Maison Dourada! Gostaria de reservar uma mesa para o buffet de café."
  },

  /* -------------------------------------------------------------- Eventos -- */
  // Para criar um evento novo, copie um bloco { … } e altere os campos.
  // Eventos com data passada somem sozinhos (ocultarPassados: true).
  eventos: {
    sobretitulo: "Agenda",
    titulo: "Eventos na Maison",
    texto: "Celebrações da nossa cozinha e da cultura de Joinville.",
    ocultarPassados: true,
    semEventos: "Novos eventos em breve. Acompanhe pelo Instagram.",
    lista: [
      {
        titulo: "Festival de Cucas",
        data: "2026-11-21",
        horario: "8h às 12h",
        local: "Salão principal da Maison Dourada",
        descricao: "Mais de 15 sabores de cuca alemã em mesa livre — banana, uva, farofa, requeijão e as receitas guardadas da família — com café coado e música ao vivo.",
        imagem: { src: "", alt: "Mesa com várias cucas alemãs fatiadas" },
        icone: "cuca",
        botao: "Quero participar"
      },
      {
        titulo: "Chineque Fest",
        data: "2027-03-06",
        horario: "15h às 19h",
        local: "Varanda e jardim da Maison Dourada",
        descricao: "Uma homenagem ao doce mais joinvilense, no aniversário da cidade: chineques de creme, nata e goiabada saindo do forno a cada meia hora.",
        imagem: { src: "", alt: "Chineques recheados sobre bandeja dourada" },
        icone: "trigo",
        botao: "Quero participar"
      }
    ]
  },

  /* ------------------------------------------------------------- História -- */
  historia: {
    sobretitulo: "Nossa história",
    titulo: "Tradição de família desde 1991",
    paragrafos: [
      "Tudo começou com um forno a lenha e um caderno de receitas trazido da Alemanha pelos bisavós. Em 1991, Dona Helga e seu Otto abriram as portas de uma pequena padaria no Centro de Joinville.",
      "Trinta e poucos anos depois, a segunda geração mantém o mesmo fermento natural e transformou o antigo salão num café pensado para quem gosta de ficar: louça de porcelana, luz baixa e tempo para conversar."
    ],
    assinatura: "Família Albrecht",
    imagem: { src: "", alt: "Fachada histórica da padaria com toldo dourado" },
    rotuloAnos: "anos de forno aceso"
  },

  /* -------------------------------------------------------------- Galeria -- */
  galeria: {
    sobretitulo: "O espaço",
    titulo: "Um café para demorar-se",
    // formato: "normal" | "largo" | "alto"  (controla o tamanho na grade)
    fotos: [
      { src: "", alt: "Salão principal ao entardecer, com lustres e mesas de madeira", formato: "largo" },
      { src: "", alt: "Mesa do buffet de café com pães, frios e bolos", formato: "alto" },
      { src: "", alt: "Balcão de pães de fermentação natural", formato: "normal" },
      { src: "", alt: "Cucas recém-saídas do forno", formato: "normal" },
      { src: "", alt: "Varanda com jardim e mesas ao ar livre", formato: "normal" },
      { src: "", alt: "Espresso servido em xícara de porcelana com friso dourado", formato: "alto" },
      { src: "", alt: "Vitrine de doces finos", formato: "normal" },
      { src: "", alt: "Cantinho de leitura com poltronas de couro", formato: "largo" }
    ]
  },

  /* ------------------------------------------------------------- Horários -- */
  // Fonte única dos horários: alimenta a tabela, o buffet, a reserva,
  // o selo "Aberto agora", o rodapé e os dados estruturados de SEO.
  // `periodos` vazio = fechado naquele dia.
  horarios: {
    sobretitulo: "Visite-nos",
    titulo: "Horários e localização",
    grupos: [
      {
        id: "padaria",
        nome: "Padaria",
        descricao: "Balcão de pães, doces e encomendas",
        linhas: [
          { dias: "Segunda a sexta", diasSemana: [1, 2, 3, 4, 5], periodos: [["06:30", "20:00"]] },
          { dias: "Sábado", diasSemana: [6], periodos: [["06:30", "19:00"]] },
          { dias: "Domingo", diasSemana: [0], periodos: [["07:00", "13:00"]] }
        ]
      },
      {
        id: "buffet",
        nome: "Buffet de café",
        descricao: "Serviço à mesa, com reserva",
        linhas: [
          { dias: "Segunda a sexta", diasSemana: [1, 2, 3, 4, 5], periodos: [["15:00", "19:00"]] },
          { dias: "Sábado", diasSemana: [6], periodos: [["08:00", "11:30"], ["15:00", "19:00"]] },
          { dias: "Domingo", diasSemana: [0], periodos: [["08:00", "12:00"]] }
        ]
      }
    ],
    observacao: "Feriados podem ter horário especial. Confira no Instagram.",
    botaoMapa: "Como chegar"
  },

  /* ----------------------------------------------------------- Encomendas -- */
  encomendas: {
    sobretitulo: "Encomendas",
    titulo: "Leve a Maison para a sua mesa",
    texto: "Pedidos com no mínimo 48 horas de antecedência. Retirada na loja ou entrega em Joinville.",
    itens: [
      {
        icone: "bolo",
        nome: "Bolos de festa",
        descricao: "Massas leves, recheios da casa e acabamento à mão. De 15 a 60 fatias.",
        preco: "a partir de R$ 129",
        imagem: { src: "", alt: "Bolo de festa com flores comestíveis" },
        mensagem: "Olá! Gostaria de encomendar um bolo de festa."
      },
      {
        icone: "cuca",
        nome: "Tortas doces e salgadas",
        descricao: "Torta alemã, de nozes, de frango com palmito e quiches inteiras.",
        preco: "a partir de R$ 98",
        imagem: { src: "", alt: "Torta alemã fatiada" },
        mensagem: "Olá! Gostaria de encomendar uma torta."
      },
      {
        icone: "cesta",
        nome: "Cestas de café da manhã",
        descricao: "Pães, cuca, geleias, frios, frutas e café. Com cartão escrito à mão.",
        preco: "a partir de R$ 159",
        imagem: { src: "", alt: "Cesta de café da manhã com laço dourado" },
        mensagem: "Olá! Gostaria de encomendar uma cesta de café da manhã."
      }
    ],
    botao: "Encomendar"
  },

  /* --------------------------------------------------------------- Rodapé -- */
  rodape: {
    texto: "Padaria artesanal e café em Joinville desde 1991. Pão de fermentação natural, cucas de família e café especial.",
    avisoDemo: "Projeto demonstrativo de portfólio. Nomes, preços, endereço e contatos são fictícios.",
    botaoFlutuante: "Fale conosco no WhatsApp"
  }
};
