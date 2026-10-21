#!/usr/bin/env node
/* =============================================================================
   sync-meta.mjs — copia os dados de SEO do config.js para o <head> do index.html.

   Por quê? Buscadores executam JavaScript, mas os "previews" de link do
   WhatsApp, Instagram e Facebook não. Este script grava no HTML estático:
   <title>, description, canonical, Open Graph, Twitter Card, favicon,
   fonte e os dados estruturados (JSON-LD de padaria) com horários e endereço.

   Uso (Node 18+, sem dependências):   node tools/sync-meta.mjs
   ============================================================================= */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(raiz, "config.js"), "utf8"), sandbox);
const cfg = sandbox.window.SITE_CONFIG;
if (!cfg) throw new Error("config.js não definiu window.SITE_CONFIG");

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const abs = (p) => (/^https?:/.test(p) ? p : new URL(p, cfg.seo.url).href);
const { seo, marca, contato, endereco: e } = cfg;

/* ---------- Dados estruturados (schema.org/Bakery) ---------------------- */
const nomesDias = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const padaria = cfg.horarios.grupos[0];
const openingHours = padaria.linhas.flatMap((l) =>
  l.periodos.map(([opens, closes]) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: l.diasSemana.map((d) => nomesDias[d]),
    opens,
    closes
  }))
);
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: marca.nomeCompleto,
  description: seo.descricao,
  url: seo.url,
  image: abs(seo.imagemOg),
  logo: abs(marca.logo.imagem),
  telephone: "+" + contato.whatsapp,
  email: contato.email,
  priceRange: seo.faixaDePreco,
  servesCuisine: ["Padaria", "Café", "Confeitaria"],
  foundingDate: String(marca.fundacao),
  acceptsReservations: true,
  address: {
    "@type": "PostalAddress",
    streetAddress: e.rua,
    addressLocality: e.cidade,
    addressRegion: e.uf,
    postalCode: e.cep,
    addressCountry: "BR"
  },
  openingHoursSpecification: openingHours,
  sameAs: [`https://www.instagram.com/${contato.instagram}/`]
};

/* ---------- Bloco do <head> -------------------------------------------- */
const bloco = `<!-- SEO:START — bloco gerado por \`node tools/sync-meta.mjs\` a partir do config.js. Não edite à mão. -->
  <title>${esc(seo.titulo)}</title>
  <meta name="description" content="${esc(seo.descricao)}">
  <link rel="canonical" href="${esc(seo.url)}">
  <meta name="theme-color" content="${esc(cfg.tema.cores.preto)}">
  <link rel="icon" href="${esc(marca.favicon)}" type="image/svg+xml">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="${esc(seo.idioma.replace("-", "_"))}">
  <meta property="og:site_name" content="${esc(marca.nomeCompleto)}">
  <meta property="og:title" content="${esc(seo.titulo)}">
  <meta property="og:description" content="${esc(seo.descricao)}">
  <meta property="og:url" content="${esc(seo.url)}">
  <meta property="og:image" content="${esc(abs(seo.imagemOg))}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(marca.nomeCompleto)}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preload" as="image" href="${esc(cfg.hero.poster)}">
  <link rel="stylesheet" href="${esc(cfg.tema.fontes.googleFontsUrl)}">
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2).replace(/^/gm, "  ").replace(/</g, "\\u003c")}
  </script>
  <!-- SEO:END -->`;

const noscript = `<!-- NOSCRIPT:START -->
    <div class="noscript">
      Este site precisa de JavaScript para exibir o conteúdo.
      Fale com a ${esc(marca.nome)} pelo WhatsApp ${esc(contato.whatsappExibicao)}.
    </div>
    <!-- NOSCRIPT:END -->`;

const arquivo = join(raiz, "index.html");
let html = readFileSync(arquivo, "utf8");
const trocar = (inicio, fim, conteudo) => {
  const re = new RegExp(`<!-- ${inicio}[\\s\\S]*?<!-- ${fim} -->`);
  if (!re.test(html)) throw new Error(`Marcadores ${inicio}/${fim} não encontrados no index.html`);
  html = html.replace(re, () => conteudo);
};
trocar("SEO:START", "SEO:END", bloco);
trocar("NOSCRIPT:START", "NOSCRIPT:END", noscript);
html = html.replace(/<html lang="[^"]*">/, `<html lang="${esc(seo.idioma)}">`);
writeFileSync(arquivo, html);
console.log("✔ index.html atualizado a partir do config.js");
