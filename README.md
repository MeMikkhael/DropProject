# FastTrack

Projeto de plataforma de dropshipping em React e JavaScript.

Está sendo usado pra estudos e testes.
## Documentos iniciais

- `docs/arquitetura-inicial.md`: analise da ideia, requisitos, riscos, arquitetura proposta, tecnologias sugeridas, estrutura inicial, banco de dados, roadmap e perguntas pendentes.
- `docs/acompanhamento.md`: diario tecnico do projeto, explicando o que foi criado e por que foi criado.
- `docs/env.md`: guia das variaveis de ambiente e como usar `.env` sem vazar segredos.

## Estado atual

Etapa atual: **Fase 1 - base do projeto**.

## Como rodar futuramente

O projeto foi preparado para usar `pnpm`, porque neste ambiente o `npm` nao esta disponivel no terminal.

Depois de instalar as dependencias:

```bash
pnpm install
pnpm build
pnpm preview:web
```

Em outro terminal, rode a API:

```bash
pnpm start:api
```

Observacao: o modo `pnpm dev` existe, mas neste ambiente encontrou uma limitacao do otimizador do Vite com permissoes de pasta. O caminho estavel por enquanto e `build` + `preview:web`.
