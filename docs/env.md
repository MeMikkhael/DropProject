# FastTrack - Guia de `.env`

Variaveis de ambiente sao configuracoes que mudam conforme o lugar onde o sistema esta rodando.

Exemplos:

- endereco da API;
- porta do servidor;
- senha do banco;
- token do Mercado Pago;
- segredo de sessao.

## Regra principal

O arquivo `.env` pode ter segredos reais. Por isso, ele nao deve ser enviado para GitHub ou compartilhado publicamente.

O arquivo `.env.example` nao deve ter segredos reais. Ele serve como modelo para explicar quais variaveis existem.

## Arquivos

- `.env`: configuracao real da sua maquina. Nao versionar.
- `.env.example`: modelo seguro. Pode versionar.

## Onde o arquivo fica

O arquivo real fica na raiz do projeto:

```text
DropPrj/.env
```

O backend carrega esse arquivo a partir de `apps/api/src/db.js`. Isso permite
iniciar a API pelo workspace sem mover o `.env` para dentro de `apps/api`.

## Exemplo seguro

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/fasttrack
SESSION_SECRET=troque-este-valor
API_PORT=3000
APP_URL=http://localhost:5173
API_URL=http://localhost:3000
```

Esses valores sao exemplos. Quando o projeto rodar de verdade, criaremos um `.env` com valores reais apenas no seu PC.

## Por que isso importa

Se um token do Mercado Pago vazar, outra pessoa pode tentar usar sua conta ou acessar informacoes sensiveis. Se a senha do banco vazar, alguem pode tentar ler ou alterar dados da loja.

Por isso, segredo real fica fora do codigo.

## Caracteres especiais na senha

Quando a senha faz parte de uma URL, caracteres especiais precisam ser
codificados. Por exemplo:

```text
@ vira %40
# vira %23
% vira %25
```

Assim, uma senha que começa com `@` nao quebra a interpretacao da
`DATABASE_URL`.

## Regra de seguranca para o dia a dia

Se uma senha ou token aparecer em um commit, captura de tela ou conversa
compartilhada, trate-o como comprometido: troque o segredo e atualize apenas o
`.env` local. Nao coloque o valor real no `.env.example`, na README ou em logs.
