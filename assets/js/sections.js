/* =============================================================================
   sections.js — monta o HTML de cada seção a partir do config.js.
   Cada função recebe o config e devolve uma string de HTML.
   As interações (menu, formulário, lightbox…) ficam em main.js.
   ============================================================================= */
(function () {
  "use strict";

  /* ========================================================== Utilitários == */
  var U = {};

  /** Escapa texto para inserir com segurança no HTML. */
  U.esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };

  /** Escapa e transforma *trecho* em <em>trecho</em> (destaque em itálico). */
  U.rich = function (s) {
    return U.esc(s).replace(/\*(.+?)\*/g, "<em>$1</em>");
  };

  /** 64.9 → "R$ 64,90"; textos ("sob consulta") passam direto. */
  U.preco = function (v) {
    if (typeof v !== "number") return U.esc(v);
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
  };

  /** "06:30" → "6h30"; "15:00" → "15h". */
  U.hora = function (hhmm) {
    var p = String(hhmm).split(":");
    var h = parseInt(p[0], 10), m = p[1] || "00";
    return h + "h" + (m === "00" ? "" : m);
  };

  /** [["08:00","11:30"],["15:00","19:00"]] → "8h às 11h30 · 15h às 19h" */
  U.periodos = function (periodos, separador) {
    if (!periodos || !periodos.length) return "Fechado";
    return periodos.map(function (p) { return U.hora(p[0]) + " às " + U.hora(p[1]); }).join(separador || " · ");
  };

  /** "HH:MM" → minutos desde a meia-noite */
  U.minutos = function (hhmm) {
    var p = String(hhmm).split(":");
    return parseInt(p[0], 10) * 60 + parseInt(p[1] || 0, 10);
  };

  /** "2026-11-21" → Date local (evita o deslocamento de fuso do new Date("…")). */
  U.data = function (iso) {
    var p = String(iso).split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  };

  /** Link wa.me com mensagem pré-preenchida. */
  U.wa = function (cfg, mensagem) {
    var txt = mensagem || cfg.contato.mensagemPadraoWhatsapp || "";
    return "https://wa.me/" + String(cfg.contato.whatsapp).replace(/\D/g, "") +
      (txt ? "?text=" + encodeURIComponent(txt) : "");
  };

  U.instagram = function (cfg) {
    return "https://www.instagram.com/" + cfg.contato.instagram + "/";
  };

  U.enderecoLinha = function (e) {
    return e.rua + " — " + e.bairro + ", " + e.cidade + "/" + e.uf;
  };

  U.maps = function (cfg) {
    var e = cfg.endereco;
    if (e.mapsUrl) return e.mapsUrl;
    var q = [cfg.marca.nomeCompleto, e.rua, e.bairro, e.cidade, e.uf, e.cep].join(", ");
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
  };

  U.grupo = function (cfg, id) {
    return (cfg.horarios.grupos || []).filter(function (g) { return g.id === id; })[0];
  };

  /** Filete dourado com losango central. */
  U.ornamento = function (extra) {
    return '<span class="ornament' + (extra ? " " + extra : "") + '" aria-hidden="true"><i></i></span>';
  };

  /**
   * Foto ou placeholder. Se `img.src` estiver vazio, desenha um bloco escuro
   * com ícone — marcado com data-placeholder para ser encontrado facilmente.
   * opts: { icone, classe, eager, tamanhos }
   */
  U.media = function (img, opts) {
    img = img || {};
    opts = opts || {};
    var cls = "media" + (opts.classe ? " " + opts.classe : "");
    if (img.src) {
      return '<div class="' + cls + '"><img src="' + U.esc(img.src) + '" alt="' + U.esc(img.alt) + '"' +
        (opts.eager ? "" : ' loading="lazy"') + ' decoding="async"></div>';
    }
    // PLACEHOLDER — troque definindo `src` da imagem no config.js
    return '<div class="' + cls + ' ph" role="img" aria-label="' + U.esc(img.alt) + '" data-placeholder="true">' +
      window.icon(opts.icone || "imagem", "ph__icon") +
      (img.alt ? '<span class="ph__label" aria-hidden="true">' + U.esc(img.alt) + "</span>" : "") +
      "</div>";
  };

  /** Cabeçalho padrão de seção. */
  U.cabecalho = function (s, id, extra) {
    return '<header class="section-head reveal' + (extra ? " " + extra : "") + '">' +
      (s.sobretitulo ? '<p class="eyebrow">' + U.esc(s.sobretitulo) + "</p>" : "") +
      '<h2 class="section-title" id="' + id + '-titulo">' + U.rich(s.titulo) + "</h2>" +
      U.ornamento() +
      (s.texto ? '<p class="section-lead">' + U.esc(s.texto) + "</p>" : "") +
      "</header>";
  };

  function botaoLink(rotulo, alvo, estilo) {
    return '<a class="btn btn--' + (estilo || "primario") + '" href="#' + U.esc(alvo) + '">' + U.esc(rotulo) + "</a>";
  }

  /* ============================================================ Seções ==== */
  var S = {};

  /* ---------------------------------------------------------- Cabeçalho -- */
  S.header = function (cfg) {
    var m = cfg.marca;
    var links = cfg.menu.map(function (item) {
      return '<li><a class="nav__link" href="#' + U.esc(item.alvo) + '">' + U.esc(item.rotulo) + "</a></li>";
    }).join("");
    return '<div class="container header__inner">' +
      '<a class="brand" href="#inicio">' +
        '<img class="brand__mark" src="' + U.esc(m.logo.imagem) + '" alt="' + (m.logo.mostrarNome ? "" : U.esc(m.logo.alt)) + '" width="44" height="44">' +
        (m.logo.mostrarNome
          ? '<span class="brand__text"><span class="brand__name">' + U.esc(m.nome) + '</span><span class="brand__sub">' + U.esc(m.complemento) + "</span></span>"
          : "") +
      "</a>" +
      '<nav class="nav" id="nav-principal" aria-label="Menu principal">' +
        '<ul class="nav__list">' + links + "</ul>" +
        '<a class="btn btn--primario btn--sm nav__cta" href="#' + U.esc(cfg.botaoMenu.alvo) + '">' + U.esc(cfg.botaoMenu.rotulo) + "</a>" +
      "</nav>" +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-principal">' +
        '<span class="visually-hidden">Abrir menu</span>' + window.icon("menu", "nav-toggle__open") + window.icon("fechar", "nav-toggle__close") +
      "</button>" +
    "</div>";
  };

  /* --------------------------------------------------------------- Hero -- */
  S.hero = function (cfg) {
    var h = cfg.hero;
    var botoes = h.botoes.map(function (b) { return botaoLink(b.rotulo, b.alvo, b.estilo); }).join("");
    return '<div class="hero__media" aria-hidden="true">' +
        // A <source> é inserida por main.js (respeita prefers-reduced-motion e economia de dados)
        '<video class="hero__video" muted loop playsinline preload="none" poster="' + U.esc(h.poster) + '" data-src="' + U.esc(h.video) + '"></video>' +
        '<div class="hero__overlay"></div>' +
      "</div>" +
      '<div class="container hero__content">' +
        '<p class="eyebrow hero__eyebrow reveal">' + U.esc(h.sobretitulo) + "</p>" +
        '<h1 class="hero__title reveal" style="--d:1">' + U.rich(h.titulo) + "</h1>" +
        U.ornamento("reveal") +
        '<p class="hero__subtitle reveal" style="--d:2">' + U.esc(h.subtitulo) + "</p>" +
        '<div class="hero__actions reveal" style="--d:3">' + botoes + "</div>" +
      "</div>" +
      '<button class="hero__toggle" type="button" aria-pressed="false" hidden>' +
        window.icon("pausa", "hero__toggle-pause") + window.icon("play", "hero__toggle-play") +
        '<span class="visually-hidden">Pausar vídeo de fundo</span>' +
      "</button>" +
      '<a class="hero__scroll" href="#buffet" aria-label="Rolar para o conteúdo"><span></span></a>';
  };

  /* ------------------------------------------------------------- Buffet -- */
  S.buffet = function (cfg) {
    var b = cfg.buffet;
    var grupo = U.grupo(cfg, b.grupoHorario);
    var itens = b.itens.map(function (it, i) {
      return '<li class="feature reveal" style="--d:' + (i % 3) + '">' +
        '<span class="feature__icon">' + window.icon(it.icone) + "</span>" +
        '<div><h3 class="feature__title">' + U.esc(it.nome) + '</h3><p class="feature__text">' + U.esc(it.descricao) + "</p></div>" +
      "</li>";
    }).join("");
    var horarios = grupo ? grupo.linhas.map(function (l) {
      return "<li><span>" + U.esc(l.dias) + "</span><span>" + U.periodos(l.periodos) + "</span></li>";
    }).join("") : "";

    return '<div class="container">' +
      U.cabecalho(b, "buffet") +
      '<div class="buffet">' +
        '<ul class="features" aria-label="O que está incluso">' + itens + "</ul>" +
        '<div class="price-card frame reveal">' +
          '<p class="price-card__label">Valor</p>' +
          '<p class="price-card__value">' + U.preco(b.preco.valor) + "</p>" +
          '<p class="price-card__unit">' + U.esc(b.preco.rotulo) + "</p>" +
          '<p class="price-card__note">' + U.esc(b.preco.observacao) + "</p>" +
          U.ornamento() +
          '<h3 class="price-card__subtitle">' + window.icon("relogio") + U.esc(b.tituloHorarios) + "</h3>" +
          '<ul class="hours-list">' + horarios + "</ul>" +
          botaoLink(b.cta.rotulo, b.cta.alvo, "primario btn--block") +
        "</div>" +
      "</div>" +
    "</div>";
  };

  /* ----------------------------------------------------------- Cardápio -- */
  S.cardapio = function (cfg) {
    var c = cfg.cardapio;
    var colunas = c.colunas.map(function (col) {
      var itens = col.itens.map(function (it) {
        return '<li class="menu-item">' +
          '<div class="menu-item__row"><span class="menu-item__name">' + U.esc(it.nome) + "</span>" +
          '<span class="menu-item__dots" aria-hidden="true"></span>' +
          '<span class="menu-item__price">' + U.preco(it.preco) + "</span></div>" +
          (it.descricao ? '<p class="menu-item__desc">' + U.esc(it.descricao) + "</p>" : "") +
        "</li>";
      }).join("");
      return '<div class="menu-col">' +
        '<h3 class="menu-col__title">' + window.icon(col.icone) + U.esc(col.titulo) + "</h3>" +
        '<ul class="menu-list">' + itens + "</ul>" +
      "</div>";
    }).join("");

    return '<div class="container">' +
      U.cabecalho(c, "cardapio", "section-head--light") +
      '<div class="menu-paper reveal">' +
        '<div class="menu-paper__inner">' +
          '<p class="menu-paper__brand">' + U.esc(cfg.marca.nome) + "</p>" +
          '<div class="menu-cols">' + colunas + "</div>" +
          (c.nota ? '<p class="menu-paper__note">' + U.esc(c.nota) + "</p>" : "") +
        "</div>" +
      "</div>" +
    "</div>";
  };

  /* ------------------------------------------------------------ Reserva -- */
  S.reserva = function (cfg) {
    var r = cfg.reserva;
    var opcoesPessoas = "";
    for (var i = 1; i <= r.maxPessoas; i++) {
      opcoesPessoas += '<option value="' + i + '"' + (i === 2 ? " selected" : "") + ">" + i + (i === 1 ? " pessoa" : " pessoas") + "</option>";
    }
    var destaques = r.destaques.map(function (d) {
      return "<li>" + window.icon(d.icone) + "<span>" + U.esc(d.texto) + "</span></li>";
    }).join("");

    function campo(id, rotulo, controle, ajuda, largo) {
      return '<div class="field' + (largo ? " field--full" : "") + '">' +
        '<label class="field__label" for="' + id + '">' + rotulo + "</label>" + controle +
        (ajuda ? '<p class="field__hint" id="' + id + '-ajuda">' + ajuda + "</p>" : "") +
        '<p class="field__error" id="' + id + '-erro" aria-live="polite"></p>' +
      "</div>";
    }

    return '<div class="container reserva">' +
      '<div class="reserva__intro">' +
        U.cabecalho(r, "reserva", "section-head--left") +
        '<ul class="perks reveal">' + destaques + "</ul>" +
        '<p class="script reveal">' + U.esc(r.manuscrita) + "</p>" +
      "</div>" +
      '<form class="booking frame frame--dark reveal" id="form-reserva" novalidate>' +
        '<p class="booking__title">Dados da reserva</p>' +
        '<div class="booking__grid">' +
          campo("r-nome", "Nome completo", '<input class="input" id="r-nome" name="nome" type="text" autocomplete="name" required maxlength="80" aria-describedby="r-nome-erro">', "", true) +
          campo("r-whats", "WhatsApp", '<input class="input" id="r-whats" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="(47) 90000-0000" required aria-describedby="r-whats-erro">', "", true) +
          campo("r-data", "Data", '<input class="input" id="r-data" name="data" type="date" required aria-describedby="r-data-ajuda r-data-erro">', "Buffet: " + U.esc(resumoDias(cfg, r.grupoHorario))) +
          campo("r-hora", "Horário", '<select class="input" id="r-hora" name="horario" required disabled aria-describedby="r-hora-erro"><option value="">Escolha a data</option></select>') +
          campo("r-pessoas", "Número de pessoas", '<select class="input" id="r-pessoas" name="pessoas" required aria-describedby="r-pessoas-erro">' + opcoesPessoas + "</select>", "", true) +
          campo("r-obs", 'Observações <span class="field__optional">(opcional)</span>', '<textarea class="input" id="r-obs" name="observacoes" rows="3" maxlength="300" placeholder="Aniversário, cadeira para bebê, restrição alimentar…" aria-describedby="r-obs-erro"></textarea>', "", true) +
        "</div>" +
        '<button class="btn btn--primario btn--block btn--lg" type="submit">' + window.icon("whatsapp") + U.esc(r.botao) + "</button>" +
        '<p class="booking__note">O WhatsApp abrirá com a mensagem pronta. A reserva é confirmada após a nossa resposta.</p>' +
        '<div class="booking__status" role="status" aria-live="polite"></div>' +
      "</form>" +
    "</div>";
  };

  /** "Seg a sex 15h às 19h · Sáb …" — resumo curto para a dica do campo de data */
  function resumoDias(cfg, idGrupo) {
    var g = U.grupo(cfg, idGrupo);
    if (!g) return "";
    return g.linhas.filter(function (l) { return l.periodos.length; })
      .map(function (l) { return l.dias.toLowerCase(); }).join(", ");
  }

  /* ------------------------------------------------------------ Eventos -- */
  S.eventos = function (cfg) {
    var ev = cfg.eventos;
    var hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    var lista = ev.lista
      .filter(function (e) { return !ev.ocultarPassados || U.data(e.data) >= hoje; })
      .sort(function (a, b) { return U.data(a.data) - U.data(b.data); });

    var mes = new Intl.DateTimeFormat("pt-BR", { month: "short" });
    var longa = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

    var cards = lista.map(function (e, i) {
      var d = U.data(e.data);
      return '<article class="event-card frame frame--dark reveal" style="--d:' + (i % 3) + '">' +
        '<div class="event-card__media">' +
          U.media(e.imagem, { icone: e.icone }) +
          '<p class="event-card__date" aria-hidden="true"><span>' + d.getDate() + "</span>" + mes.format(d).replace(".", "") + "</p>" +
        "</div>" +
        '<div class="event-card__body">' +
          '<h3 class="event-card__title">' + U.esc(e.titulo) + "</h3>" +
          '<ul class="meta">' +
            "<li>" + window.icon("calendario") + '<time datetime="' + U.esc(e.data) + '">' + longa.format(d) + "</time></li>" +
            "<li>" + window.icon("relogio") + U.esc(e.horario) + "</li>" +
            "<li>" + window.icon("local") + U.esc(e.local) + "</li>" +
          "</ul>" +
          '<p class="event-card__text">' + U.esc(e.descricao) + "</p>" +
          '<a class="btn btn--secundario btn--sm" href="' + U.esc(U.wa(cfg, "Olá! Quero participar do " + e.titulo + " (" + longa.format(d) + ").")) + '" target="_blank" rel="noopener">' +
            window.icon("whatsapp") + U.esc(e.botao || "Saiba mais") + '<span class="visually-hidden"> do ' + U.esc(e.titulo) + " (abre o WhatsApp)</span></a>" +
        "</div>" +
      "</article>";
    }).join("");

    return '<div class="container">' +
      U.cabecalho(ev, "eventos", "section-head--light") +
      (cards
        ? '<div class="events">' + cards + "</div>"
        : '<p class="empty reveal">' + U.esc(ev.semEventos) + "</p>") +
    "</div>";
  };

  /* ----------------------------------------------------------- História -- */
  S.historia = function (cfg) {
    var h = cfg.historia;
    var anos = new Date().getFullYear() - cfg.marca.fundacao;
    var paragrafos = h.paragrafos.map(function (p) { return "<p>" + U.esc(p) + "</p>"; }).join("");
    return '<div class="container story">' +
      '<div class="story__media reveal">' +
        U.media(h.imagem, { icone: "trigo", classe: "media--portrait" }) +
        '<p class="story__badge"><span class="story__years">' + anos + "</span>" + U.esc(h.rotuloAnos) + "</p>" +
      "</div>" +
      '<div class="story__text">' +
        U.cabecalho(h, "historia", "section-head--left") +
        '<div class="prose reveal">' + paragrafos + "</div>" +
        '<p class="script script--dark reveal">' + U.esc(h.assinatura) + "</p>" +
      "</div>" +
    "</div>";
  };

  /* ------------------------------------------------------------ Galeria -- */
  S.galeria = function (cfg) {
    var g = cfg.galeria;
    var itens = g.fotos.map(function (f, i) {
      return '<li class="gallery__cell gallery__cell--' + U.esc(f.formato || "normal") + ' reveal" style="--d:' + (i % 4) + '">' +
        '<button class="gallery__item" type="button" data-index="' + i + '">' +
          U.media(f, { icone: "imagem" }) +
          '<span class="visually-hidden">Ampliar foto: ' + U.esc(f.alt) + "</span>" +
        "</button>" +
      "</li>";
    }).join("");
    return '<div class="container">' +
      U.cabecalho(g, "galeria", "section-head--light") +
      '<ul class="gallery">' + itens + "</ul>" +
    "</div>";
  };

  /* ----------------------------------------------------------- Horários -- */
  S.horarios = function (cfg) {
    var h = cfg.horarios;
    var e = cfg.endereco;
    var tabelas = h.grupos.map(function (g) {
      var linhas = g.linhas.map(function (l) {
        return '<tr><th scope="row">' + U.esc(l.dias) + "</th><td>" + U.periodos(l.periodos, "<br>") + "</td></tr>";
      }).join("");
      return '<div class="hours-card frame reveal">' +
        '<div class="hours-card__head">' +
          '<h3 class="hours-card__title">' + U.esc(g.nome) + "</h3>" +
          '<span class="status" data-status="' + U.esc(g.id) + '"></span>' +
        "</div>" +
        (g.descricao ? '<p class="hours-card__desc">' + U.esc(g.descricao) + "</p>" : "") +
        '<table class="hours-table"><caption class="visually-hidden">Horários — ' + U.esc(g.nome) + "</caption>" +
          '<thead class="visually-hidden"><tr><th scope="col">Dias</th><th scope="col">Horário</th></tr></thead>' +
          "<tbody>" + linhas + "</tbody></table>" +
      "</div>";
    }).join("");

    return '<div class="container">' +
      U.cabecalho(h, "horarios") +
      '<div class="visit">' +
        '<div class="visit__hours">' + tabelas +
          (h.observacao ? '<p class="visit__note">' + U.esc(h.observacao) + "</p>" : "") +
        "</div>" +
        '<div class="location frame frame--dark reveal">' +
          '<a class="map-art" href="' + U.esc(U.maps(cfg)) + '" target="_blank" rel="noopener" aria-label="Abrir localização no Google Maps">' +
            '<span class="map-art__pin">' + window.icon("local") + "</span>" +
          "</a>" +
          '<div class="location__body">' +
            '<h3 class="location__title">' + U.esc(cfg.marca.nome) + "</h3>" +
            '<address class="location__address">' + U.esc(e.rua) + "<br>" + U.esc(e.bairro) + " · " + U.esc(e.cidade) + "/" + U.esc(e.uf) + "<br>CEP " + U.esc(e.cep) + "</address>" +
            (e.referencia ? '<p class="location__ref">' + U.esc(e.referencia) + "</p>" : "") +
            '<div class="location__actions">' +
              '<a class="btn btn--primario btn--sm" href="' + U.esc(U.maps(cfg)) + '" target="_blank" rel="noopener">' + window.icon("local") + U.esc(h.botaoMapa) + "</a>" +
              '<a class="btn btn--secundario btn--sm" href="' + U.esc(U.wa(cfg)) + '" target="_blank" rel="noopener">' + window.icon("whatsapp") + U.esc(cfg.contato.whatsappExibicao) + "</a>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>" +
    "</div>";
  };

  /* --------------------------------------------------------- Encomendas -- */
  S.encomendas = function (cfg) {
    var en = cfg.encomendas;
    var cards = en.itens.map(function (it, i) {
      return '<article class="order-card frame reveal" style="--d:' + i + '">' +
        U.media(it.imagem, { icone: it.icone, classe: "media--wide" }) +
        '<div class="order-card__body">' +
          '<h3 class="order-card__title">' + U.esc(it.nome) + "</h3>" +
          '<p class="order-card__text">' + U.esc(it.descricao) + "</p>" +
          '<p class="order-card__price">' + U.preco(it.preco) + "</p>" +
          '<a class="btn btn--outline-dark btn--sm" href="' + U.esc(U.wa(cfg, it.mensagem)) + '" target="_blank" rel="noopener">' +
            window.icon("whatsapp") + U.esc(en.botao) + '<span class="visually-hidden"> ' + U.esc(it.nome) + " (abre o WhatsApp)</span></a>" +
        "</div>" +
      "</article>";
    }).join("");
    return '<div class="container">' +
      U.cabecalho(en, "encomendas") +
      '<div class="orders">' + cards + "</div>" +
    "</div>";
  };

  /* ------------------------------------------------------------- Rodapé -- */
  S.footer = function (cfg) {
    var m = cfg.marca, c = cfg.contato, e = cfg.endereco;
    var horarios = cfg.horarios.grupos.map(function (g) {
      return '<p class="footer__group">' + U.esc(g.nome) + "</p><ul>" +
        g.linhas.map(function (l) {
          return "<li>" + U.esc(l.dias) + ": " + U.periodos(l.periodos) + "</li>";
        }).join("") + "</ul>";
    }).join("");

    return '<div class="container footer__grid">' +
      '<div class="footer__brand">' +
        '<a class="brand brand--footer" href="#inicio">' +
          '<img class="brand__mark" src="' + U.esc(m.logo.imagem) + '" alt="" width="52" height="52" loading="lazy">' +
          '<span class="brand__text"><span class="brand__name">' + U.esc(m.nome) + '</span><span class="brand__sub">' + U.esc(m.complemento) + "</span></span>" +
        "</a>" +
        '<p class="footer__text">' + U.esc(cfg.rodape.texto) + "</p>" +
        '<div class="footer__social">' +
          '<a href="' + U.esc(U.instagram(cfg)) + '" target="_blank" rel="noopener" aria-label="Instagram @' + U.esc(c.instagram) + '">' + window.icon("instagram") + "</a>" +
          '<a href="' + U.esc(U.wa(cfg)) + '" target="_blank" rel="noopener" aria-label="WhatsApp ' + U.esc(c.whatsappExibicao) + '">' + window.icon("whatsapp") + "</a>" +
          '<a href="mailto:' + U.esc(c.email) + '" aria-label="E-mail ' + U.esc(c.email) + '">' + window.icon("email") + "</a>" +
        "</div>" +
      "</div>" +
      '<div class="footer__col"><h2 class="footer__title">Contato</h2><ul>' +
        '<li><a href="' + U.esc(U.wa(cfg)) + '" target="_blank" rel="noopener">WhatsApp ' + U.esc(c.whatsappExibicao) + "</a></li>" +
        '<li><a href="' + U.esc(U.instagram(cfg)) + '" target="_blank" rel="noopener">@' + U.esc(c.instagram) + "</a></li>" +
        '<li><a href="mailto:' + U.esc(c.email) + '">' + U.esc(c.email) + "</a></li>" +
      "</ul></div>" +
      '<div class="footer__col"><h2 class="footer__title">Endereço</h2>' +
        "<address>" + U.esc(e.rua) + "<br>" + U.esc(e.bairro) + " · " + U.esc(e.cidade) + "/" + U.esc(e.uf) + "<br>CEP " + U.esc(e.cep) + "</address>" +
        '<a class="footer__link" href="' + U.esc(U.maps(cfg)) + '" target="_blank" rel="noopener">Ver no Google Maps</a>' +
      "</div>" +
      '<div class="footer__col"><h2 class="footer__title">Horários</h2>' + horarios + "</div>" +
    "</div>" +
    '<div class="container footer__bottom">' +
      "<p>© " + new Date().getFullYear() + " " + U.esc(m.nomeCompleto) + "</p>" +
      (m.demo ? '<p class="footer__demo">' + U.esc(cfg.rodape.avisoDemo) + "</p>" : "") +
      '<a class="footer__top" href="#inicio">Voltar ao topo ↑</a>' +
    "</div>";
  };

  /* ------------------------------------------------ WhatsApp flutuante -- */
  S["wa-float"] = function (cfg, el) {
    el.href = U.wa(cfg);
    el.setAttribute("aria-label", cfg.rodape.botaoFlutuante + " (abre em nova aba)");
    return window.icon("whatsapp") + '<span class="wa-float__label" aria-hidden="true">' + U.esc(cfg.rodape.botaoFlutuante) + "</span>";
  };

  window.MD = { utils: U, sections: S };
})();
