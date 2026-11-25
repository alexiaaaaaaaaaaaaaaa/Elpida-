# Elpida — App (React puro, sem Ionic)

Versão fiel ao protótipo do Figma, com **perfil editável usado no app inteiro**, **mapa funcional** de rede de apoio
(OpenStreetMap + Overpass API), **busca / notificações / menu em todas as telas internas**, CPF, sessão persistida,
foto de perfil e posts.

## Novidades desta versão

1. **Busca, notificações e menu em TODAS as telas internas.** Agora as telas internas dividem o mesmo layout
   (`components/AppLayout.tsx`) e cada uma só renderiza `<AppHeader />` (ou `HeaderActions` no Perfil). Os três
   botões redondos do Figma funcionam de verdade:
   - **Busca** (`SearchPanel`): procura em páginas, livros, artigos, timeline e nos seus posts.
   - **Notificações** (`NotificationsPanel`): lista com contador e "marcar como lidas"; algumas dependem do
     perfil (ex.: pede para informar o gênero se estiver vazio).
   - **Menu** (`SideMenu`): menu lateral roxo que abre pela direita, como no Figma.
2. **Perfil editável de ponta a ponta** — nome, idade, gênero e foto (`/perfil/editar` e na configuração da
   conta). Eles alimentam: saudação do cabeçalho (**Bem-vinda / Bem-vindo / Boas-vindas** conforme o gênero e
   primeiro nome), Perfil, aba "Sobre", menu lateral, notificações e a autoria dos seus posts na Timeline.
3. **Mapa no lugar do chat** (`/mapa`) — Leaflet + OpenStreetMap e Overpass API (sem chave): delegacias da mulher,
   delegacias, hospitais e bombeiros num raio de 6 km (amplia para 15 km se não achar nada), com filtros, distância
   e botão "Como chegar". Se um servidor da Overpass estiver fora, o app tenta outro automaticamente.
4. **Telas do Figma que faltavam**: abertura (splash), Timeline, Livro (detalhe), Leitura, Ciclo da violência com
   fases, e as páginas "Como pedir ajuda?" / "Como se proteger?".
5. **Visual alinhado ao Figma**: cabeçalho roxo `#44175a` com botões creme, barra de navegação creme com ícones
   roxos (Início em verde), prateleiras da Biblioteca, hero roxo do Perfil, logo (escudo com flor) em SVG.

## Como rodar

```bash
npm install
npm run dev
```

Abre em **http://localhost:5173**.

⚠️ **Importante sobre o Mapa**: ele faz chamadas de rede reais (Overpass API + tiles do OpenStreetMap), então
só funciona com o navegador tendo acesso à internet e com a permissão de localização concedida. Em `localhost`
a maioria dos navegadores libera geolocalização sem exigir HTTPS; se você hospedar em produção, vai precisar de
HTTPS para a geolocalização funcionar (exigência dos navegadores, não do código).

## Estrutura

```
src/
  components/  AppLayout, AppHeader (+HeaderActions), SearchPanel, NotificationsPanel, SideMenu,
               BottomNav, BookCover, Logo, PageTitle, Avatar
  context/     UserContext (perfil, sessão, posts, curtidas/salvos, estado dos livros)
  data/        content.ts (livros, artigos, timeline, ciclo da violência, páginas de ajuda)
  pages/       uma página por tela
  utils/       cpf, image, places (Overpass), searchIndex, notifications, storage
```


## Sobre o Mapa (delegacias, hospitais, bombeiros)

Os dados vêm do **OpenStreetMap** via **Overpass API**, gratuita e sem necessidade de chave. Isso significa:
- A qualidade dos resultados depende do quão completo o mapeamento colaborativo está na sua região — em
  cidades grandes costuma ser bom; em áreas menores pode haver menos pontos cadastrados.
- Não existe uma tag padrão do OpenStreetMap para "delegacia da mulher" — o app resolve isso filtrando
  delegacias (`amenity=police`) cujo nome contém "mulher", o que cobre a maioria dos casos reais mas pode
  perder alguma que esteja com o nome cadastrado de forma diferente.
- Para uso em produção/alto tráfego, o ideal seria migrar os tiles do mapa para um provedor pago (Mapbox,
  MapTiler, Google Maps) — o servidor gratuito de tiles do OpenStreetMap usado aqui é só para demonstração e
  desenvolvimento, não para uso comercial intenso.
