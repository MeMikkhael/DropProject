# FastTrack

Projeto de estudos para uma plataforma de dropshipping nacional.

O FastTrack esta sendo construido com React no frontend, Express no backend e
PostgreSQL para armazenar os dados. Neste momento, o objetivo principal e
aprender o fluxo completo de uma aplicacao web: tela, API e banco de dados.

## O que ja existe

- Interface inicial da loja em React.
- API criada com Express.
- Endpoint de visao geral em `/api/overview`.
- Endpoint de produtos em `/api/products`.
- Conexao da API com PostgreSQL usando o pacote `pg`.
- Configuracao de seguranca basica com Helmet e CORS.
- Dados de exemplo para visualizar a loja antes do catalogo real.

## Como o projeto funciona

O navegador acessa o frontend. O frontend faz uma requisicao para a API. A API
processa a requisicao e, quando necessario, consulta o PostgreSQL.

```text
React (frontend) -> Express (API) -> PostgreSQL (banco de dados)
```

### Pastas principais

```text
apps/
	api/
		src/server.js   # Rotas e inicializacao da API
		src/db.js       # Conexao com o PostgreSQL
	web/
		src/App.jsx     # Componente principal do frontend
		src/main.jsx    # Entrada da aplicacao React
		src/styles.css  # Estilos da interface
docs/               # Documentacao e decisoes do projeto
packages/shared/    # Codigo que podera ser compartilhado entre os apps
```

## Pre-requisitos

Instale estes programas antes de iniciar:

- Node.js
- pnpm
- PostgreSQL

Depois, na raiz do projeto, instale as dependencias:

```bash
pnpm install
```

## Configurando o ambiente

Crie um arquivo `.env` na raiz do projeto, ao lado do `package.json`.

Use o arquivo `.env.example` como modelo. A variavel mais importante para o
banco e:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/fasttrack
```

Nunca publique o `.env`, tokens ou senhas no GitHub. O arquivo `.env.example`
deve conter apenas valores de exemplo.

## Rodando em desenvolvimento

Abra dois terminais na pasta raiz do projeto.

### Terminal 1: API

```bash
pnpm dev:api
```

A API ficara disponivel em:

```text
http://localhost:3000
```

### Terminal 2: frontend

```bash
pnpm dev:web
```

O Vite normalmente abre o frontend em:

```text
http://127.0.0.1:5173
```

Se essa porta estiver ocupada, ele escolhera outra, como `5174`. Use o endereco
mostrado no terminal.

## Rotas disponiveis

### Verificar se a API esta funcionando

```text
GET http://localhost:3000/health
```

### Buscar informacoes gerais da loja

```text
GET http://localhost:3000/api/overview
```

### Buscar produtos

```text
GET http://localhost:3000/api/products
```

### Gerenciar recomendações

```text
GET  http://localhost:3000/api/recommendations
POST http://localhost:3000/api/recommendations
POST http://localhost:3000/api/recommendations/import/mercado-livre
POST http://localhost:3000/api/recommendations/:id/approve
POST http://localhost:3000/api/recommendations/:id/reject
```

O cadastro aceita recomendações vindas do scraper ou inseridas manualmente.
Uma recomendação começa como `PENDING`. O administrador pode aprová-la, o que
cria um registro em `products`, ou rejeitá-la, o que muda seu estado para
`REJECTED`.

O sistema mantém no máximo 100 recomendações pendentes. Pendências com mais de
30 dias são removidas automaticamente durante a limpeza diária e também antes
da listagem ou de um novo cadastro.

Enquanto o OAuth do Mercado Livre não está configurado, a importação usa dados
simulados. A margem enviada no cadastro é usada para calcular o preço sugerido,
e itens repetidos são ignorados pela chave de duplicidade.

## Testando a conexao com o PostgreSQL

A partir da raiz do projeto, execute:

```bash
node -e "import('./apps/api/src/db.js').then(async ({ pool }) => { const result = await pool.query('SELECT NOW()'); console.log(result.rows[0]); await pool.end(); }).catch((error) => { console.error(error.message); process.exit(1); });"
```

Se tudo estiver correto, o terminal mostrara o horario retornado pelo banco.

## Comandos principais

| Comando | Funcao |
| --- | --- |
| `pnpm install` | Instala as dependencias |
| `pnpm dev:api` | Inicia a API em modo desenvolvimento |
| `pnpm dev:web` | Inicia o frontend em modo desenvolvimento |
| `pnpm build` | Gera o build de producao do frontend |
| `pnpm preview:web` | Visualiza o build localmente |
| `pnpm start:api` | Inicia a API sem modo de observacao |

## Proximos passos

1. Definir os parâmetros de recomendação do scraper.
2. Adicionar autenticação e controle de acesso ao painel.
3. Adicionar edição e desativação de produtos.
4. Registrar histórico das decisões do administrador.
5. Integrar pagamentos depois que o fluxo básico estiver estável.

## Documentacao complementar

- [Arquitetura inicial](docs/arquitetura-inicial.md)
- [Acompanhamento tecnico](docs/acompanhamento.md)
- [Configuracao de ambiente](docs/env.md)
