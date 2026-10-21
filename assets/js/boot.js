/* =============================================================================
   boot.js — roda no <head>, antes da primeira pintura.
   Aplica cores e fontes do config.js como variáveis CSS e atualiza título/
   descrição em tempo de execução (para o caso de o sync-meta não ter sido rodado).
   ============================================================================= */
(function () {
  "use strict";
  var cfg = window.SITE_CONFIG;
  var root = document.documentElement;
  root.classList.add("js");

  if (!cfg) return;

  /* --- Cores: tema.cores.* → --cor-* -------------------------------------- */
  var mapaCores = {
    preto: "--cor-preto",
    dourado: "--cor-dourado",
    douradoClaro: "--cor-dourado-claro",
    douradoEscuro: "--cor-dourado-escuro",
    creme: "--cor-creme",
    cremeEscuro: "--cor-creme-escuro",
    cafe: "--cor-cafe"
  };
  var cores = (cfg.tema && cfg.tema.cores) || {};
  Object.keys(mapaCores).forEach(function (k) {
    if (cores[k]) root.style.setProperty(mapaCores[k], cores[k]);
  });

  /* --- Fontes ------------------------------------------------------------- */
  var fontes = (cfg.tema && cfg.tema.fontes) || {};
  if (fontes.titulo) root.style.setProperty("--fonte-titulo", fontes.titulo);
  if (fontes.texto) root.style.setProperty("--fonte-texto", fontes.texto);
  if (fontes.manuscrita) root.style.setProperty("--fonte-manuscrita", fontes.manuscrita);
  if (fontes.googleFontsUrl && !document.querySelector('link[href="' + fontes.googleFontsUrl + '"]')) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = fontes.googleFontsUrl;
    document.head.appendChild(link);
  }

  /* --- SEO em tempo de execução (o HTML estático vem do sync-meta) -------- */
  var seo = cfg.seo || {};
  if (seo.titulo) document.title = seo.titulo;
  function meta(seletor, valor) {
    var el = document.head.querySelector(seletor);
    if (el && valor) el.setAttribute("content", valor);
  }
  meta('meta[name="description"]', seo.descricao);
  meta('meta[property="og:title"]', seo.titulo);
  meta('meta[property="og:description"]', seo.descricao);
})();
