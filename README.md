# Maison Dourada Padaria e Café

Site institucional demo de uma padaria e confeitaria fictícia em Joinville/SC, feito para portfólio.
O foco é vender a experiência do espaço (buffet de café, reservas e eventos).
**Todos os textos, preços, endereço e contatos são provisórios.**

HTML, CSS e JavaScript puros, sem build e sem dependências.

## Como abrir

Dê dois cliques no `index.html`, ou sirva a pasta:

```bash
python3 -m http.server 8000   # depois abra http://localhost:8000
```

Para publicar, envie a pasta inteira para qualquer hospedagem estática (Netlify, Vercel, GitHub Pages, cPanel…).

## Estrutura

```
config.js              ← ÚNICO arquivo com os dados da marca (edite este)
index.html             ← esqueleto da página (seções na ordem em que aparecem)
assets/css/styles.css  ← estilos; cores e fontes como variáveis no topo
assets/js/boot.js      ← aplica cores/fontes do config antes da pintura
assets/js/icons.js     ← ícones de traço fino
assets/js/sections.js  ← monta o HTML de cada seção a partir do config
assets/js/main.js      ← menu, vídeo, animações, reserva, lightbox, "Aberto agora"
assets/img/            ← logo, favicon, poster do vídeo, imagem de compartilhamento
assets/video/hero.mp4  ← vídeo de fundo do topo
tools/sync-meta.mjs    ← copia SEO/Open Graph do config para o index.html
```

## Trocar a identidade

Tudo fica em **`config.js`**. Os passos mais comuns:

| O quê | Onde no `config.js` |
|---|---|
| Nome e subtítulo | `marca.nome`, `marca.complemento`, `marca.nomeCompleto` |
| Logo | Coloque o arquivo em `assets/img/` e aponte `marca.logo.imagem`. Se o logo já tem o nome escrito, use `mostrarNome: false` |
| Cores | `tema.cores` (preto, dourado, douradoClaro, douradoEscuro, creme, cremeEscuro, cafe) |
| Fontes | `tema.fontes` (famílias) + `tema.fontes.googleFontsUrl` |
| WhatsApp, Instagram, e-mail | `contato` (WhatsApp só com números: `55` + DDD + número) |
| Endereço e mapa | `endereco` (o link do Google Maps é montado sozinho, ou use `mapsUrl`) |
| Horários | `horarios.grupos` — fonte única: alimenta a tabela, o buffet, os horários da reserva, o selo "Aberto agora" e o rodapé |
| Textos e preços | cada seção tem seu bloco: `hero`, `buffet`, `cardapio`, `reserva`, `eventos`, `historia`, `galeria`, `encomendas`, `rodape` |

Detalhes úteis:

- **Preços** aceitam número (`64.9` vira "R$ 64,90") ou texto (`"a partir de R$ 129"`).
- **Destaque em itálico** nos títulos: envolva o trecho com asteriscos, ex.: `"Café, pão e *tradição*"`.
- As cores do `config.js` sobrescrevem as variáveis `--cor-*` do topo do `styles.css`. Se preferir, edite direto no CSS.
- `douradoEscuro` é o dourado usado em **texto sobre fundo claro**; mantenha-o escuro para garantir contraste.

### Fotos

Onde não há foto, o site mostra um **placeholder** escuro com ícone e a descrição da imagem.
Para trocar, coloque a foto em `assets/img/` e preencha o `src` correspondente no `config.js`:

```js
imagem: { src: "assets/img/historia.jpg", alt: "Fachada da padaria com toldo dourado" }
```

Use `.jpg` ou `.webp` com cerca de 1600 px no lado maior e sempre escreva um `alt` descritivo.
Na galeria, `formato: "largo"` ou `"alto"` ocupa duas colunas ou duas linhas da grade.

### Eventos

Copie um bloco dentro de `eventos.lista` e altere os campos. A data vai no formato `"AAAA-MM-DD"`.
Os eventos são ordenados por data e os que já passaram somem sozinhos (`ocultarPassados: true`).

### Vídeo do topo

O vídeo atual é um **placeholder** gerado (bokeh dourado, 300 KB). Substitua `assets/video/hero.mp4`
e o poster `assets/img/hero-poster.jpg` (primeiro quadro, exibido enquanto carrega). Para comprimir
abaixo de 5 MB, sem áudio e pronto para web:

```bash
ffmpeg -i original.mov -t 15 -vf "scale=1280:-2,fps=24" -c:v libx264 -crf 28 -preset slow \
  -pix_fmt yuv420p -movflags +faststart -an assets/video/hero.mp4
ffmpeg -i assets/video/hero.mp4 -frames:v 1 -q:v 4 assets/img/hero-poster.jpg
```

O vídeo não carrega quando a pessoa pede menos movimento (`prefers-reduced-motion`) ou está no modo de
economia de dados. Nesses casos aparece só o poster. Há também um botão discreto para pausar o vídeo.

### SEO e compartilhamento

Título, descrição e imagem de compartilhamento ficam em `seo`. Depois de editar, rode:

```bash
node tools/sync-meta.mjs
```

O script grava no `<head>` do `index.html` o título, a descrição, o canonical, as tags Open Graph e
Twitter e os dados estruturados (`schema.org/Bakery`, com endereço e horários). Isso é necessário porque
os previews do WhatsApp e do Instagram não executam JavaScript. Troque também
`assets/img/og-image.jpg` (1200×630).

## Recursos

- Página única com menu fixo, rolagem suave, link ativo por seção e menu em tela cheia no celular.
- Reserva de mesa validada: os horários disponíveis mudam conforme o dia escolhido. Ao enviar, abre o WhatsApp com a mensagem pronta (`wa.me` com texto codificado).
- Selo "Aberto agora / Fechado agora" calculado no fuso de Joinville.
- Galeria com lightbox: teclado (← → Esc), gesto de deslizar e devolução do foco ao fechar.
- Acessibilidade: link "Pular para o conteúdo", foco visível, `alt` nas imagens, contraste AA, rótulos nos formulários e mensagens de erro anunciadas. Sem violações no axe-core.
- Animações discretas de entrada, desligadas com `prefers-reduced-motion`.
