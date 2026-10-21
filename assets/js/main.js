/* =============================================================================
   main.js — renderiza as seções e liga as interações:
   menu fixo/mobile, vídeo do hero, animações de entrada, formulário de reserva
   (WhatsApp), lightbox da galeria e selo "Aberto agora".
   ============================================================================= */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG;
  var U = window.MD.utils;
  var S = window.MD.sections;
  var reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ============================================================ Render ==== */
  document.querySelectorAll("[data-render]").forEach(function (el) {
    var fn = S[el.getAttribute("data-render")];
    if (fn) el.innerHTML = fn(cfg, el);
  });

  initHeader();
  initHero();
  initReveal();
  initReserva();
  initLightbox();
  initStatus();

  /* ======================================================== Cabeçalho ==== */
  function initHeader() {
    var header = document.querySelector(".site-header");
    var toggle = header.querySelector(".nav-toggle");
    var nav = header.querySelector(".nav");
    var rotulo = toggle.querySelector(".visually-hidden");
    var desktop = window.matchMedia("(min-width: 70em)");

    // Fundo sólido depois de sair do topo
    function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 24); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    function setOpen(aberto) {
      header.classList.toggle("is-open", aberto);
      document.body.classList.toggle("no-scroll", aberto);
      toggle.setAttribute("aria-expanded", String(aberto));
      rotulo.textContent = aberto ? "Fechar menu" : "Abrir menu";
    }
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    desktop.addEventListener("change", function () { setOpen(false); });

    // Link ativo conforme a seção visível
    var links = {};
    nav.querySelectorAll(".nav__link").forEach(function (a) { links[a.hash.slice(1)] = a; });
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = links[en.target.id];
        if (!a) return;
        if (en.isIntersecting) {
          Object.keys(links).forEach(function (k) {
            links[k].classList.remove("is-active");
            links[k].removeAttribute("aria-current");
          });
          a.classList.add("is-active");
          a.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main > section[id]").forEach(function (s) { io.observe(s); });
  }

  /* ======================================================= Vídeo hero ==== */
  function initHero() {
    var video = document.querySelector(".hero__video");
    var botao = document.querySelector(".hero__toggle");
    if (!video) return;
    var rotulo = botao.querySelector(".visually-hidden");
    var economia = navigator.connection && navigator.connection.saveData;
    var pausadoPeloUsuario = false;

    function carregar() {
      if (video.querySelector("source")) return;
      var src = document.createElement("source");
      src.src = video.getAttribute("data-src");
      src.type = "video/mp4";
      video.appendChild(src);
      video.load();
    }
    function tocar() {
      carregar();
      var p = video.play();
      if (p && p.catch) p.catch(function () { atualizar(); });
    }
    function atualizar() {
      var parado = video.paused;
      botao.setAttribute("aria-pressed", String(parado));
      rotulo.textContent = parado ? "Reproduzir vídeo de fundo" : "Pausar vídeo de fundo";
      botao.classList.toggle("is-paused", parado);
    }

    botao.hidden = false;
    botao.addEventListener("click", function () {
      if (video.paused) { pausadoPeloUsuario = false; tocar(); }
      else { pausadoPeloUsuario = true; video.pause(); }
    });
    video.addEventListener("play", atualizar);
    video.addEventListener("pause", atualizar);
    video.addEventListener("error", function () { botao.hidden = true; }, true);

    // Respeita prefers-reduced-motion e economia de dados: fica só o poster.
    if (reduzMovimento.matches || economia) {
      atualizar();
    } else {
      tocar();
    }

    // Pausa quando o hero sai da tela (economiza bateria)
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        var visivel = entries[0].isIntersecting;
        if (!visivel && !video.paused) video.pause();
        else if (visivel && video.paused && !pausadoPeloUsuario && !reduzMovimento.matches && !economia) tocar();
      }, { threshold: 0.1 }).observe(video);
    }
  }

  /* ============================================ Animações de entrada ===== */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (reduzMovimento.matches || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    document.documentElement.classList.add("anim");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ========================================================= Reserva ====== */
  function initReserva() {
    var form = document.getElementById("form-reserva");
    if (!form) return;
    var r = cfg.reserva;
    var grupo = U.grupo(cfg, r.grupoHorario);
    var f = {
      nome: form.elements.nome,
      whatsapp: form.elements.whatsapp,
      data: form.elements.data,
      horario: form.elements.horario,
      pessoas: form.elements.pessoas,
      observacoes: form.elements.observacoes
    };
    var status = form.querySelector(".booking__status");

    // Data mínima = hoje + antecedência
    var min = new Date();
    min.setDate(min.getDate() + (r.antecedenciaMinimaDias || 0));
    f.data.min = isoLocal(min);

    // Máscara (47) 99999-9999
    f.whatsapp.addEventListener("input", function () {
      var d = f.whatsapp.value.replace(/\D/g, "").slice(0, 11);
      var out = d;
      if (d.length > 2) out = "(" + d.slice(0, 2) + ") " + d.slice(2);
      if (d.length > 6) out = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(-4);
      f.whatsapp.value = out;
    });

    // Horários disponíveis mudam conforme o dia da semana escolhido
    f.data.addEventListener("change", function () {
      preencherHorarios();
      if (f.data.value) validar("data");
    });

    function slotsDoDia(iso) {
      if (!iso || !grupo) return [];
      var dia = U.data(iso);
      var linha = grupo.linhas.filter(function (l) { return l.diasSemana.indexOf(dia.getDay()) > -1; })[0];
      if (!linha) return [];
      var agora = new Date();
      var ehHoje = iso === isoLocal(agora);
      var minAgora = agora.getHours() * 60 + agora.getMinutes() + 30;
      var passo = r.intervaloMinutos || 30;
      var slots = [];
      linha.periodos.forEach(function (p) {
        var fim = U.minutos(p[1]) - (r.ultimaReservaAntes || 0);
        for (var m = U.minutos(p[0]); m <= fim; m += passo) {
          if (!ehHoje || m >= minAgora) slots.push(m);
        }
      });
      return slots;
    }

    function preencherHorarios() {
      var slots = slotsDoDia(f.data.value);
      var atual = f.horario.value;
      var html = '<option value="">' + (f.data.value ? (slots.length ? "Selecione" : "Sem horários") : "Escolha a data") + "</option>";
      slots.forEach(function (m) {
        var v = pad(Math.floor(m / 60)) + ":" + pad(m % 60);
        html += '<option value="' + v + '"' + (v === atual ? " selected" : "") + ">" + U.hora(v) + "</option>";
      });
      f.horario.innerHTML = html;
      f.horario.disabled = !slots.length;
    }

    var regras = {
      nome: function () {
        return f.nome.value.trim().length >= 3 ? "" : "Informe seu nome.";
      },
      whatsapp: function () {
        var n = f.whatsapp.value.replace(/\D/g, "").length;
        return n === 10 || n === 11 ? "" : "Informe um WhatsApp com DDD, ex.: (47) 99999-0000.";
      },
      data: function () {
        if (!f.data.value) return "Escolha a data.";
        if (f.data.value < f.data.min) return "Escolha uma data a partir de hoje.";
        if (!slotsDoDia(f.data.value).length) {
          return f.data.value === isoLocal(new Date())
            ? "Não há mais horários hoje. Escolha outra data."
            : "O buffet não abre neste dia. Escolha outra data.";
        }
        return "";
      },
      horario: function () {
        return f.horario.value ? "" : "Escolha o horário.";
      },
      pessoas: function () {
        return f.pessoas.value ? "" : "Informe o número de pessoas.";
      },
      observacoes: function () { return ""; }
    };

    function validar(nome) {
      var msg = regras[nome]();
      var campo = f[nome];
      var erro = document.getElementById(campo.id + "-erro");
      campo.setAttribute("aria-invalid", msg ? "true" : "false");
      campo.closest(".field").classList.toggle("has-error", !!msg);
      erro.textContent = msg;
      return !msg;
    }

    // Valida ao sair do campo (só depois que a pessoa interagiu)
    Object.keys(f).forEach(function (k) {
      f[k].addEventListener("blur", function () { if (f[k].value) validar(k); });
      f[k].addEventListener("change", function () {
        if (f[k].closest(".field").classList.contains("has-error")) validar(k);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var invalidos = Object.keys(f).filter(function (k) { return !validar(k); });
      if (invalidos.length) {
        status.className = "booking__status is-error";
        status.textContent = "Confira os campos destacados.";
        f[invalidos[0]].focus();
        return;
      }

      var dataFmt = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })
        .format(U.data(f.data.value));
      var linhas = [
        r.mensagemIntro,
        "",
        "*Nome:* " + f.nome.value.trim(),
        "*WhatsApp:* " + f.whatsapp.value,
        "*Data:* " + dataFmt,
        "*Horário:* " + U.hora(f.horario.value),
        "*Pessoas:* " + f.pessoas.value
      ];
      if (f.observacoes.value.trim()) linhas.push("*Observações:* " + f.observacoes.value.trim());

      var url = U.wa(cfg, linhas.join("\n"));
      var janela = window.open(url, "_blank", "noopener");
      if (!janela) window.location.href = url; // pop-up bloqueado: abre na mesma aba

      status.className = "booking__status is-ok";
      status.innerHTML = window.icon("check") +
        "<span>Abrimos o WhatsApp com a sua reserva. É só tocar em enviar. " +
        'Não abriu? <a href="' + U.esc(url) + '" target="_blank" rel="noopener">Clique aqui</a>.</span>';
    });

    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function isoLocal(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  }

  /* ========================================================= Lightbox ===== */
  function initLightbox() {
    var dialog = document.getElementById("lightbox");
    var itens = document.querySelectorAll(".gallery__item");
    if (!dialog || !itens.length || typeof dialog.showModal !== "function") return;

    var fotos = cfg.galeria.fotos;
    var media = dialog.querySelector(".lightbox__media");
    var legenda = dialog.querySelector(".lightbox__caption");
    var contador = dialog.querySelector(".lightbox__count");
    var atual = 0, origem = null;

    dialog.querySelector('[data-lb="close"]').innerHTML = window.icon("fechar");
    dialog.querySelector('[data-lb="prev"]').innerHTML = window.icon("anterior");
    dialog.querySelector('[data-lb="next"]').innerHTML = window.icon("proximo");

    function mostrar(i) {
      atual = (i + fotos.length) % fotos.length;
      var f = fotos[atual];
      media.innerHTML = U.media(f, { icone: "imagem", eager: true });
      legenda.textContent = f.alt;
      contador.textContent = (atual + 1) + " de " + fotos.length;
    }

    itens.forEach(function (btn) {
      btn.addEventListener("click", function () {
        origem = btn;
        mostrar(Number(btn.getAttribute("data-index")));
        dialog.showModal();
        document.body.classList.add("no-scroll");
      });
    });

    dialog.addEventListener("click", function (e) {
      var acao = e.target.closest("[data-lb]");
      if (acao) {
        var a = acao.getAttribute("data-lb");
        if (a === "close") dialog.close();
        else mostrar(atual + (a === "next" ? 1 : -1));
      } else if (e.target === dialog) {
        dialog.close(); // clique no fundo escuro
      }
    });
    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") mostrar(atual + 1);
      if (e.key === "ArrowLeft") mostrar(atual - 1);
    });
    dialog.addEventListener("close", function () {
      document.body.classList.remove("no-scroll");
      if (origem) origem.focus();
    });

    // Gesto de deslizar no celular
    var x0 = null;
    dialog.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    dialog.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  /* ================================================ "Aberto agora" ======== */
  function initStatus() {
    var selos = document.querySelectorAll("[data-status]");
    if (!selos.length) return;
    var dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    var fmt;
    try {
      fmt = new Intl.DateTimeFormat("en-US", {
        timeZone: cfg.seo.fusoHorario || undefined,
        weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
      });
    } catch (e) {
      fmt = new Intl.DateTimeFormat("en-US", { weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    }

    function agoraNoFuso() {
      var p = {};
      fmt.formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      return { dia: dias[p.weekday], min: parseInt(p.hour, 10) * 60 + parseInt(p.minute, 10) };
    }

    function atualizar() {
      var agora = agoraNoFuso();
      selos.forEach(function (el) {
        var g = U.grupo(cfg, el.getAttribute("data-status"));
        var linha = g.linhas.filter(function (l) { return l.diasSemana.indexOf(agora.dia) > -1; })[0];
        var aberto = !!linha && linha.periodos.some(function (p) {
          return agora.min >= U.minutos(p[0]) && agora.min < U.minutos(p[1]);
        });
        el.textContent = aberto ? "Aberto agora" : "Fechado agora";
        el.classList.toggle("is-open", aberto);
      });
    }
    atualizar();
    setInterval(atualizar, 60000);
  }
})();
