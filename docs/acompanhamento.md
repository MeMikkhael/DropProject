# FastTrack - Acompanhamento tecnico

Este arquivo e o diario tecnico do projeto. A ideia e registrar o que foi criado, por que foi criado e quais conceitos voce precisa entender para acompanhar o desenvolvimento.

## Fase 1 - Base do projeto

Objetivo: criar a estrutura inicial sem ainda construir as regras completas da loja.

### O que esta sendo criado

- Um monorepo com `apps/web`, `apps/api` e `packages/shared`.
- `apps/web`: interface React da loja e do painel administrativo.
- `apps/api`: servidor Node.js com Express.
- `packages/shared`: codigo JavaScript compartilhado entre frontend e backend.
- `.env.example`: modelo das configuracoes sem segredos reais.
- `docs/env.md`: explicacao de variaveis de ambiente.

### Por que separar web e api

A loja que o cliente ve e o painel que o administrador usa rodam no frontend. Ja a API fica responsavel por regras sensiveis: login, produtos, pedidos, calculo de preco, pagamento e futuramente scraping.

Essa separacao ajuda a proteger dados importantes. Por exemplo, o token do Mercado Pago por exemplo, nunca deve ficar no React, porque codigo do frontend pode ser visto pelo navegador. Ele deve ficar no backend.

### O que e monorepo

Monorepo e um repositorio que guarda varias partes do sistema no mesmo lugar. Neste projeto, isso facilita trabalhar com:

- frontend;
- backend;
- codigo compartilhado;
- documentacao.

### O que ainda nao entrou nesta fase

- Banco PostgreSQL real.
- Prisma.
- Autenticacao.
- Mercado Pago real.
- Scraper real.
- Admin completo.

Essas partes entram nas fases seguintes para manter o aprendizado organizado.

## Decisoes atuais

- JavaScript primeiro, sem TypeScript.
- React com Vite no frontend.
- Node.js com Express no backend.
- Mercado Pago sera o primeiro pagamento real, com checkout redirecionado.
- PostgreSQL e Prisma serao usados quando entrarmos na fase de banco.
- A primeira versao roda localmente antes de publicar na internet.

## Como rodar a base atual

Neste ambiente, a build do React funciona normalmente. O modo dev do Vite encontrou uma limitacao de permissao durante a otimizacao de dependencias, entao o caminho recomendado por enquanto e:

```bash
pnpm install
pnpm build
pnpm preview:web
```

Em outro terminal:

```bash
pnpm start:api
```

Isso serve a interface construida em `http://127.0.0.1:4173` e a API em `http://localhost:3000`.
