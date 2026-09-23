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

## Exemplo seguro

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/fasttrack
SESSION_SECRET=troque-este-valor
```

Esses valores sao exemplos. Quando o projeto rodar de verdade, criaremos um `.env` com valores reais apenas no seu PC.

## Por que isso importa

Se um token do Mercado Pago vazar, outra pessoa pode tentar usar sua conta ou acessar informacoes sensiveis. Se a senha do banco vazar, alguem pode tentar ler ou alterar dados da loja.

Por isso, segredo real fica fora do codigo.
