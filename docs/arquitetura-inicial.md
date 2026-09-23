# FastTrack - Arquitetura inicial

Este documento trata o conteudo de `org drp.md` como briefing do projeto. Ele nao implementa a aplicacao ainda. A etapa atual e analisar, propor arquitetura e levantar decisoes que precisam de aprovacao antes do primeiro codigo.

## 1. Avaliacao da ideia

A ideia e viavel, mas deve ser construida em fases. Uma loja de dropshipping envolve loja online, painel administrativo, pagamentos, estoque, fornecedores, automacoes, seguranca, logs, infraestrutura e atendimento ao cliente. Se tudo for feito de uma vez, o projeto fica dificil de entender, testar e manter.

O melhor caminho e criar primeiro uma base solida:

- loja simples;
- painel administrativo protegido;
- cadastro manual de produtos;
- pedidos;
- calculo correto de preco, margem e frete;
- banco de dados bem modelado;
- documentacao clara;
- seguranca basica desde o inicio.

Depois disso, adicionamos automacoes, integracoes e scraping por etapas.

## 2. Requisitos ja definidos

- Nome inicial da marca: FastTrack.
- Frontend em React.
- Linguagem principal: JavaScript.
- Nao usar TypeScript inicialmente.
- Backend tambem em JavaScript, se aprovado.
- Servidor inicial: o proprio PC do usuario.
- Projeto bem documentado.
- Loja responsiva, moderna, simples e com cores quentes.
- Painel administrativo separado da area do cliente.
- Suporte futuro a promocoes, cupons e estrategias de preco.
- Diferenciar produto do fornecedor de produto publicado na FastTrack.
- Considerar custo do produto, frete, margem, estoque e promocao no calculo de preco.
- Arquitetura preparada para fornecedores, APIs, integracoes autorizadas e scraping modular.
- Nao implementar scraping sem analisar legalidade, estabilidade e permissao da fonte.
- Seguranca desde o inicio: HTTPS, validacao, protecao contra SQL Injection, XSS, CSRF, rate limiting, secrets e logs.
- Explicacoes didaticas durante o desenvolvimento.
- Implementar em fases, apos aprovacao da arquitetura.

## 3. Requisitos que ainda faltam

Antes de codar, precisamos definir:

- Pais/moeda principal da loja. - BRL
- Idioma inicial da loja. - PT-BR
- Publico-alvo. - GERAL
- Categorias iniciais de produtos. - TECNOLOGIA
- Se a venda sera nacional ou internacional. - NACIONAL
- Como o pagamento sera processado. - pra uma conta MEI
- Como o frete sera calculado. - COM BASE NA LOJA DO PRODUTO ANUNCIADO
- Se havera checkout proprio ou redirecionado. - Pode ter os dois. Adiciona aqueles menus flutuantes com o simbolo do paypal pra pagar redirecionando ou então a pessoa tem a opção logo abaixo de preencher direto no site
- Politica de devolucao, troca e cancelamento. - vamos trabalhar com a possibilidade disso, é possível cancelar 
- Termos de uso e politica de privacidade:
  ## Conformidade brasileira

A FastTrack será inicialmente voltada ao mercado brasileiro.

A arquitetura e os documentos da plataforma devem considerar,
quando aplicável:

- LGPD (Lei nº 13.709/2018);
- Código de Defesa do Consumidor;
- regras brasileiras aplicáveis ao comércio eletrônico;
- proteção de dados;
- cookies e tecnologias de rastreamento;
- direitos do consumidor;
- devoluções e direito de arrependimento;
- informações de preço, frete e prazo;
- emissão/documentação fiscal conforme a operação;
- tratamento e compartilhamento de dados com fornecedores,
  processadores de pagamento e transportadoras.

Não invente requisitos jurídicos.
Quando uma questão depender do tipo de produto, modelo
tributário, fornecedor ou estrutura empresarial, sinalize isso
e peça informações antes de implementar.

A documentação jurídica deverá ser separada da implementação
técnica. A aplicação deve ser construída para conseguir cumprir
essas políticas, e não simplesmente exibir textos jurídicos.

- Fornecedores iniciais. - Quero começar com mercado livre e Ali Express
- Se algum fornecedor tem API oficial. - Não sei
- Se o estoque sera atualizado manualmente no MVP. - O estoque pode ser atualizado sim manualmente mas da seguinte forma, no dashboard de ADM ja quero ver os produtos que tem no site e a disponibilidade deles nas lojas e os preços, daí eu decido se vamos adicionar novamente ou se ele vai estar esgotado.
- Como sera feita a emissao fiscal, se aplicavel. - ainda não sei exatamente mas vou poder emitir automaticamente por causa do MEI
- Se o painel admin tera apenas um usuario inicialmente ou varios perfis. Apenas u musuário inciialmente mas precisa ser escalável.
- Como o PC-servidor ficara disponivel: IP fixo, DDNS, dominio, roteador, portas e energia. 
Não sei ainda como disponibilizar meu PC como servidor. Antes de implementar, explique as opções (IP público/fixo, DDNS, domínio, NAT/port forwarding, HTTPS/reverse proxy, Cloudflare, etc.), os custos, riscos e o que é necessário no meu caso. Depois me faça as perguntas necessárias para escolher a configuração.
So que pretendo usar o cloudfare free, cloudfare tunnel, nunc amexi com ele, nem sei como fazer.
- Rotina de backup.
backup semanal
- Estrategia de logs e monitoramento.
não sei ainda tmabém
## 4. Riscos tecnicos

- Rodar producao no proprio PC exige cuidado com disponibilidade, energia, internet e seguranca.- Estou ciente, precisamos trabalhar nisso juntos. me ajude.
- IP residencial pode mudar e dificultar acesso externo. Compreendo, mas precisamos começar de algum lugar.
- Provedor de internet pode bloquear portas. - Como podemos evitar isso?
- Scraping pode quebrar quando sites mudam HTML. - Como lidamos com sites que mudam o html?
- Scraping pode violar termos de uso de fornecedores. - Analisamos os que permitem pra utilizar a API oficial e qualquer coisa nós utilizamos uma API separada pra não dar problema pra empresa.
- Calculo incorreto de frete ou margem pode gerar prejuizo. - De fato, por isso não pode haver erro.
- Automatizar publicacao de produtos sem revisao pode publicar dados errados. - Por isso teremos revisões.
- Loja lenta ou instavel pode reduzir conversao. - Risco necessário por enquanto.
- Falta de backup pode causar perda de pedidos e produtos. - Backup pode ser diário então.

## 4.1 Decisoes atualizadas do MVP

Estas decisoes foram adicionadas apos as respostas do usuario.

- Mercado inicial: Brasil.
- Moeda: BRL.
- Idioma: PT-BR.
- Publico-alvo: geral.
- Categoria inicial: tecnologia.
- Venda inicial: nacional.
- Pagamento inicial: Mercado Pago.
- Checkout inicial: redirecionado para Mercado Pago.
- Dominio: ainda nao existe; comecaremos localmente.
- Servidor: primeira versao local, no PC, antes de publicar na internet.
- Exposicao futura: estudar Cloudflare Free com Cloudflare Tunnel.
- Banco de dados recomendado: PostgreSQL desde o inicio, com explicacoes durante o desenvolvimento.
- Ferramenta de banco recomendada: Prisma, por equilibrar produtividade, seguranca e clareza para evoluir o projeto.
- Painel admin: comeca com um unico administrador, mas modelado para permitir perfis/permissoes depois.
- Emissao fiscal: ainda nao definida; tratar como trilha futura e manter pedidos bem registrados para facilitar emissao externa ou integracao futura.
- Backup: diario, porque pedidos e produtos mudam com frequencia.
- Scraping: deve existir um primeiro scraper real no projeto, mas com publicacao manual. O scraper nao publica direto na loja; ele alimenta uma aba de produtos recomendados.

## 4.2 Fluxo aprovado para produtos recomendados por scraping

A ideia do MVP nao sera "scraper publica produto automaticamente". O fluxo correto sera:

1. Admin cadastra uma regra de busca ou fonte inicial.
2. Sistema executa um scraper real, limitado e documentado.
3. Sistema salva os resultados como produtos recomendados.
4. Admin ve nome, preco, frete quando disponivel, estoque/disponibilidade quando disponivel, imagem, link original e fonte.
5. Admin abre o site real do produto para conferir.
6. Admin aprova, rejeita ou deixa pendente.
7. Apenas produtos aprovados viram produtos publicados na FastTrack.

Essa decisao protege contra produtos errados, preco desatualizado, frete mal calculado e publicacao indevida.

Importante: antes de implementar scraper para Mercado Livre ou AliExpress, precisamos verificar API oficial, termos de uso e alternativas autorizadas. Se a API oficial atender, ela deve ser preferida ao scraping.

## 4.3 Emissao fiscal e MEI

O usuario ainda nao tem MEI e ainda nao sabe emitir nota fiscal. Portanto:

- nao vamos fingir que a emissao fiscal esta resolvida;
- nao vamos implementar emissao automatica no MVP;
- vamos registrar pedidos, itens, cliente, valores, frete e status de pagamento de forma organizada;
- depois estudaremos MEI, obrigacoes, emissao fiscal e possiveis integracoes.

Esta parte depende de orientacao contabil/juridica e da forma final de operacao. O sistema deve ficar preparado, mas nao deve inventar regras fiscais.

## 5. Riscos de seguranca

- Vazamento de senhas, tokens ou chaves de API.
- Acesso indevido ao painel administrativo.
- SQL Injection: tentativa de manipular consultas ao banco por entradas maliciosas.
- XSS: injecao de scripts em paginas vistas por usuarios ou administradores.
- CSRF: tentativa de fazer um usuario autenticado executar uma acao sem perceber.
- Ataques de forca bruta no login.
- Logs contendo dados sensiveis.
- Exposicao direta do banco de dados na internet.
- Falta de HTTPS, permitindo interceptacao de dados.

## 6. Arquitetura proposta

Proposta inicial: aplicacao web dividida em frontend, backend, banco de dados e processos de automacao.

### Frontend

React para:

- loja publica;
- area do cliente;
- painel administrativo.

Podemos usar rotas separadas, por exemplo:

- `/`: loja;
- `/produto/:slug`: pagina de produto;
- `/carrinho`: carrinho;
- `/checkout`: checkout;
- `/conta`: area do cliente;
- `/admin`: painel administrativo.

### Backend

Node.js com Express.

Papel do backend:

- fornecer API para o frontend;
- autenticar usuarios;
- controlar permissoes;
- validar dados;
- calcular precos;
- gerenciar pedidos;
- salvar dados no banco;
- integrar pagamentos;
- integrar fornecedores;
- disparar automacoes.

### Banco de dados

PostgreSQL e a sugestao principal.

Motivo: e robusto, gratuito, confiavel, bom para dados relacionais como usuarios, produtos, pedidos, fornecedores, precos, estoque e promocoes.

Alternativa mais simples para estudo inicial: SQLite. Porem, para loja real em producao, PostgreSQL e mais adequado.

### Automacoes

Criar uma camada separada para tarefas de segundo plano:

- pesquisar produtos;
- atualizar precos;
- atualizar estoque;
- registrar erros;
- processar integracoes;
- futuramente rodar scrapers.

No inicio, isso pode ser feito com jobs simples em Node.js. Mais tarde, podemos adicionar uma fila como BullMQ com Redis.

### Reverse proxy e HTTPS

Para hospedar no proprio PC, a arquitetura recomendada e:

Internet -> dominio -> roteador -> reverse proxy -> backend/frontend

O reverse proxy recomendado e Caddy ou Nginx.

Sugestao inicial: Caddy, porque facilita HTTPS automatico com Let's Encrypt quando o dominio esta configurado corretamente.

## 7. Tecnologias sugeridas

- React: interface da loja e painel.
- Vite: ambiente simples e rapido para React.
- Node.js: backend em JavaScript.
- Express: API HTTP.
- PostgreSQL: banco de dados principal.
- Prisma ou Knex: acesso ao banco com migrations.
- Zod ou Joi: validacao de entrada.
- bcrypt: protecao de senhas.
- express-session ou JWT: autenticacao, a decidir.
- Helmet: cabecalhos de seguranca.
- express-rate-limit: limitar tentativas abusivas.
- Caddy ou Nginx: reverse proxy e HTTPS.
- Dotenv: carregar variaveis de ambiente locais.
- Winston ou Pino: logs estruturados.

Decisao importante: escolher entre Prisma e Knex. Prisma e mais amigavel e documentado, mas adiciona uma camada de abstracao. Knex fica mais perto de SQL. Para reaprender banco de dados, Knex pode ensinar mais; para produtividade, Prisma pode ser melhor.

## 8. Estrutura inicial proposta

```text
DropPrj/
  README.md
  docs/
    arquitetura-inicial.md
    env.md
    seguranca.md
    deploy-pc.md
  apps/
    web/
      package.json
      src/
        pages/
        components/
        styles/
    api/
      package.json
      src/
        server.js
        routes/
        controllers/
        services/
        middlewares/
        db/
  packages/
    shared/
      price/
      validation/
  scripts/
  .env.example
  .gitignore
```

Essa estrutura separa loja/painel (`apps/web`) da API (`apps/api`) e deixa espaco para codigo compartilhado (`packages/shared`).

## 9. Modelo inicial do banco de dados

Modelo conceitual inicial:

- `users`: clientes e administradores.
- `roles`: permissoes, como admin e cliente.
- `customers`: dados de cliente.
- `addresses`: enderecos de entrega.
- `supplier_sources`: fornecedores/fontes.
- `supplier_products`: produtos encontrados no fornecedor.
- `products`: produtos publicados na FastTrack.
- `product_variants`: variacoes como tamanho, cor ou modelo.
- `inventory_snapshots`: historico de estoque.
- `price_rules`: regras de margem e preco.
- `promotions`: promocoes.
- `coupons`: cupons futuros.
- `carts`: carrinhos.
- `orders`: pedidos.
- `order_items`: itens do pedido.
- `payments`: pagamentos.
- `shipments`: entregas.
- `automation_jobs`: tarefas de automacao.
- `automation_logs`: logs das automacoes.
- `audit_logs`: historico de acoes administrativas.

Regra importante: `supplier_products` nao deve ser o mesmo que `products`. O primeiro representa o produto na fonte. O segundo representa o produto publicado na sua loja, com preco, margem, descricao, status e promocao proprios.

## 10. Fluxo de dados proposto

### Publicacao manual no MVP

1. Admin cadastra fornecedor.
2. Admin cadastra produto do fornecedor.
3. Sistema calcula preco sugerido com custo, frete e margem.
4. Admin revisa e publica produto na loja.
5. Cliente ve produto.
6. Cliente compra.
7. Pedido fica registrado.
8. Admin processa pedido com fornecedor.
9. Cliente acompanha status.

### Automacao futura

1. Admin cria uma regra de busca.
2. Worker executa busca via API, integracao autorizada ou scraper aprovado.
3. Sistema salva produtos encontrados em `supplier_products`.
4. Sistema calcula margem, frete e preco sugerido.
5. Admin aprova publicacao.
6. Produto vira `products` na loja.

Recomendacao: no comeco, nao publicar automaticamente sem revisao humana. Primeiro validamos qualidade dos dados.

## 11. Roadmap de desenvolvimento

### Fase 0 - Decisoes e preparacao

- Aprovar arquitetura.
- Escolher banco de dados.
- Escolher estrategia de autenticacao.
- Definir moeda, pais, idioma e forma de pagamento.
- Documentar `.env`.
- Criar repositorio Git.

### Fase 1 - Base do projeto

- Criar frontend React com Vite.
- Criar backend Node/Express.
- Criar estrutura de pastas.
- Criar `.env.example`.
- Criar documentacao inicial.
- Configurar lint/formatacao se aprovado.

### Fase 2 - Banco e autenticacao

- Configurar banco.
- Criar migrations.
- Criar usuarios.
- Criar login.
- Criar protecao do painel admin.
- Adicionar rate limiting e validacao.

### Fase 3 - Catalogo e precificacao

- Cadastrar fornecedores.
- Cadastrar produtos do fornecedor.
- Cadastrar produtos publicados.
- Calcular preco com custo, frete e margem.
- Exibir produtos na loja.

### Fase 4 - Carrinho e pedidos

- Carrinho.
- Checkout inicial.
- Pedidos.
- Status de pedido.
- Area do cliente.

### Fase 5 - Pagamentos e frete

- Integrar gateway de pagamento aprovado.
- Integrar ou configurar calculo de frete.
- Registrar pagamento e entrega.

### Fase 6 - Painel administrativo

- Dashboard.
- Pedidos.
- Produtos.
- Fornecedores.
- Margens.
- Promocoes.
- Logs de automacoes.

### Fase 7 - Automacoes controladas

- Jobs agendados.
- Importacao por API oficial.
- Atualizacao de preco e estoque.
- Logs e alertas.

### Fase 8 - Scraping modular

- Criar interface de fonte.
- Implementar primeiro scraper apenas para fonte aprovada.
- Respeitar limites, termos de uso e estabilidade.
- Revisao manual antes da publicacao.

### Fase 9 - Producao no PC

- Dominio.
- DNS ou DDNS.
- Reverse proxy.
- HTTPS.
- Firewall.
- Backups.
- Monitoramento.
- Rotina de atualizacao.

## 12. Perguntas antes de implementar

1. Qual pais e moeda principal da loja? Exemplo: Portugal/EUR, Brasil/BRL, Espanha/EUR.
2. A loja sera inicialmente em portugues do Brasil, portugues de Portugal, espanhol ou outro idioma?
3. Quais categorias de produto voce quer vender primeiro?
4. Voce ja tem fornecedores em mente?
5. Algum fornecedor oferece API oficial?
6. Voce quer pagamento por Stripe, PayPal, Mercado Pago, MB Way, Pix, cartao, transferencia ou outro?
7. O checkout deve ser dentro da loja ou pode redirecionar para o provedor de pagamento?
8. Voce quer usar PostgreSQL desde o inicio ou prefere SQLite para aprender primeiro?
9. Para acesso ao banco, prefere uma ferramenta mais didatica e proxima de SQL, ou uma mais produtiva?
10. O painel admin comecara com apenas um administrador?
11. Voce ja tem dominio?
12. Seu provedor de internet permite abrir portas no roteador?
13. Seu IP e fixo ou muda com o tempo?
14. O PC ficara ligado 24 horas?
15. Voce quer que a primeira versao seja somente local, acessivel apenas no seu PC/rede, antes de abrir para internet?

## 13. Decisoes que precisam de aprovacao

- Usar Node.js + Express no backend.
- Usar PostgreSQL como banco principal.
- Usar Prisma como ferramenta de acesso ao banco, com explicacoes didaticas sobre o que acontece no banco.
- Usar Mercado Pago como pagamento inicial, com checkout redirecionado.
- Comecar localmente, sem dominio e sem publicar na internet.
- Estudar Cloudflare Free + Cloudflare Tunnel para exposicao futura, antes de abrir portas no roteador.
- Criar um scraper real controlado para alimentar uma aba de produtos recomendados, sem publicacao automatica.
- Separar produto do fornecedor de produto publicado.
- Exigir aprovacao manual antes de publicar produtos vindos de automacao.
- Implementar primeiro uma versao local/privada antes de expor o PC na internet.
- Deixar emissao fiscal fora do MVP, mas registrar pedidos de forma organizada para facilitar MEI, emissao manual ou integracao futura.

## 14. Observacao sobre `.env`

O arquivo `.env` guarda configuracoes locais e segredos, como senha do banco, chaves de API e tokens. Ele nao deve ir para o Git.

O projeto deve ter:

- `.env`: arquivo real, local, nao versionado.
- `.env.example`: modelo sem segredos reais, versionado.

Exemplo de `.env.example`:

```env
NODE_ENV=development
APP_URL=http://localhost:5173
API_URL=http://localhost:3000
DATABASE_URL=postgresql://usuario:senha@localhost:5432/fasttrack
SESSION_SECRET=troque-este-valor
```

O `.env.example` ensina quais variaveis existem, mas nunca deve conter senhas reais.
