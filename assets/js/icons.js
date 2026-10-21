/* =============================================================================
   icons.js — ícones de traço fino (24×24) usados no site.
   Use pelo nome no config.js (ex.: icone: "cafe"). Para adicionar um ícone,
   inclua uma nova chave com o atributo `d` de um <path>.
   ============================================================================= */
(function () {
  "use strict";

  var TRACO = {
    cafe: "M4 9h13v4.5A5.5 5.5 0 0 1 11.5 19h-2A5.5 5.5 0 0 1 4 13.5V9zM17 10.5h1.5a2.5 2.5 0 0 1 0 5H16.6M8 2.8c-.9 1 .9 2 0 3.2M12 2.8c-.9 1 .9 2 0 3.2M3 21.5h16",
    trigo: "M12 22V7M12 7c-1.8-1-2.6-2.8-2.4-5 1.9.4 2.8 2.3 2.4 5zm0 0c1.8-1 2.6-2.8 2.4-5-1.9.4-2.8 2.3-2.4 5zM12 12.5c-2.6-.3-4.4-1.9-5-4.3 2.4 0 4.2 1.6 5 4.3zm0 0c2.6-.3 4.4-1.9 5-4.3-2.4 0-4.2 1.6-5 4.3zM12 17.5c-2.6-.3-4.4-1.9-5-4.3 2.4 0 4.2 1.6 5 4.3zm0 0c2.6-.3 4.4-1.9 5-4.3-2.4 0-4.2 1.6-5 4.3z",
    frios: "M3 18.5V11l13.5-6L21 11v7.5H3zM3 11h18M8 15.2h.01M14.5 14.7a1.4 1.4 0 1 0 0 .01M18 16.5h.01",
    bolo: "M3.5 21h17M5 21v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7M5 16.2c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 5 0M12 12V8.5M12 6c.9-.8.9-1.8 0-2.8-.9 1-.9 2 0 2.8z",
    cuca: "M2.5 17.5 12 6l9.5 11.5H2.5zM2.5 17.5V20h19v-2.5M8 14h.01M12 11h.01M15.5 14.2h.01M11 15.2h.01",
    suco: "M6 3.5h12l-1.6 16.6A1.5 1.5 0 0 1 14.9 21.5H9.1a1.5 1.5 0 0 1-1.5-1.4L6 3.5zM6.6 9.5h10.8M14.5 6.5l3-4.5",
    gelado: "M6.5 4h11l-1.3 16.2a1.5 1.5 0 0 1-1.5 1.3H9.3a1.5 1.5 0 0 1-1.5-1.3L6.5 4zM9.2 9h3.2v3.2H9.2zM12.6 13.8h2.6v2.6h-2.6zM13 4l1.5-2.5",
    calendario: "M4 5.5h16V21H4zM4 10h16M8 3v4.5M16 3v4.5",
    relogio: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM12 7v5l3.2 2",
    local: "M12 21.5s-7-6.3-7-12a7 7 0 0 1 14 0c0 5.7-7 12-7 12zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
    pessoas: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20.5a6.5 6.5 0 0 1 13 0M16 4.3a3.5 3.5 0 0 1 0 6.6M18 14.4a6.5 6.5 0 0 1 3.5 6.1",
    presente: "M4 11h16v10H4zM3 7h18v4H3zM12 7v14M12 7c-1.4-3-5-3.6-5-1.4C7 7 10 7 12 7zm0 0c1.4-3 5-3.6 5-1.4C17 7 14 7 12 7z",
    cesta: "M2.5 10h19l-2.2 10.2a1 1 0 0 1-1 .8H5.7a1 1 0 0 1-1-.8L2.5 10zM7 10l4-6.5M17 10l-4-6.5M9 13.5v4M12 13.5v4M15 13.5v4",
    imagem: "M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M15.5 9.5a1.5 1.5 0 1 0 0-.01",
    instagram: "M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17.3 6.7h.01",
    email: "M3 5.5h18v13H3zM3.5 6.5l8.5 6.5 8.5-6.5",
    menu: "M4 7h16M4 12h16M4 17h16",
    fechar: "M6 6l12 12M18 6 6 18",
    anterior: "M15 5l-7 7 7 7",
    proximo: "M9 5l7 7-7 7",
    seta: "M5 12h14M13 6l6 6-6 6",
    check: "M5 12.5l4.5 4.5L19.5 7",
    alerta: "M12 3.5 2.5 20h19L12 3.5zM12 10v4.5M12 17.2h.01"
  };

  // Ícones preenchidos (marca e controles de mídia)
  var PREENCHIDO = {
    whatsapp: "M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.4 4.8 5-1.3A9.8 9.8 0 1 0 12 2.2zm0 17.9c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.1 8.1 0 1 1 12 20.1zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z",
    play: "M8 5.5v13l10.5-6.5z",
    pausa: "M7.5 5.5h3v13h-3zM13.5 5.5h3v13h-3z"
  };

  /**
   * Retorna o SVG de um ícone como string.
   * @param {string} nome  chave em TRACO ou PREENCHIDO
   * @param {string} [classe] classe CSS extra
   */
  window.icon = function (nome, classe) {
    var cls = "icon" + (classe ? " " + classe : "");
    if (PREENCHIDO[nome]) {
      return '<svg class="' + cls + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="' + PREENCHIDO[nome] + '"/></svg>';
    }
    var d = TRACO[nome] || TRACO.imagem;
    return '<svg class="' + cls + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
  };
})();
