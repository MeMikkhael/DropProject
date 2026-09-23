import React, { useEffect, useState } from "react";

// 1) Dados de exemplo para mostrar produtos na tela
const featuredProducts = [
  {
    name: "Hub USB-C 7 em 1",
    price: "R$ 149,90",
    tag: "Produto exemplo",
    source: "Cadastro manual"
  },
  {
    name: "Fone Bluetooth compacto",
    price: "R$ 89,90",
    tag: "Produto exemplo",
    source: "Recomendado futuro"
  },
  {
    name: "Suporte articulado para notebook",
    price: "R$ 119,90",
    tag: "Produto exemplo",
    source: "Cadastro manual"
  }
];

// 2) URL padrão do backend para não quebrar se a variável de ambiente não existir
const DEFAULT_API_URL = "http://localhost:3000";

// 3) Função para montar a mensagem do status da API
function getOverviewStatus(overview, loading, error) {
  if (loading) {
    return "Conectando ao backend...";
  }

  if (error) {
    return error;
  }

  return `${overview?.market ?? "Brasil"} · ${overview?.currency ?? "BRL"}`;
}

// 4) Função para montar o resumo de pagamento vindo do backend
function getPaymentSummary(overview) {
  if (!overview) {
    return "Produtos recomendados por scraper com aprovacao manual";
  }

  return `${overview.paymentProvider} · ${overview.phase}`;
}

// 5) Componente principal da aplicação
export function App() {
  // Estado para guardar os dados do backend
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 6) Busca os dados do backend quando a página abre
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL ?? DEFAULT_API_URL;

    fetch(`${apiUrl}/api/overview`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        setOverview(data);
      })
      .catch(() => {
        setError("Não foi possível conectar com a API.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 7) Mensagens prontas para exibir na tela
  const overviewStatus = getOverviewStatus(overview, loading, error);
  const paymentSummary = getPaymentSummary(overview);

  // 8) Estrutura visual da página
  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <strong className="brand">FastTrack</strong>
          <span className="subtitle">Dropshipping nacional em construcao</span>
        </div>

        <nav className="nav">
          <a href="#loja">Loja</a>
          <a href="#admin">Admin</a>
          <a href="#seguranca">Seguranca</a>
        </nav>
      </header>

      <section className="hero" id="loja">
        <div className="hero-copy">
          <p className="eyebrow">MVP local</p>
          <h1>{overview ? overview.brand : "Base inicial da FastTrack"}</h1>
          <p>
            Esta tela ainda nao e a loja final. Ela serve como primeira interface
            para validar estrutura, estilo visual e comunicacao com a API.
          </p>

          <div className="actions">
            <a className="primary-action" href="#produtos">
              Ver produtos
            </a>
            <a className="secondary-action" href="#admin">
              Ver painel
            </a>
          </div>
        </div>

        <div className="hero-panel" aria-label="Resumo do MVP">
          <div>
            <span className="icon-dot">API</span>
            <span>{overviewStatus}</span>
          </div>

          <div>
            <span className="icon-dot">PR</span>
            <span>{paymentSummary}</span>
          </div>

          <div>
            <span className="icon-dot">OK</span>
            <span>Seguranca planejada desde o inicio</span>
          </div>
        </div>
      </section>

      <section className="section" id="produtos">
        <div className="section-heading">
          <p className="eyebrow">Catalogo</p>
          <h2>Produtos de exemplo</h2>
        </div>

        <div className="product-grid">
          {featuredProducts.map((product) => (
            <article className="product-card" key={product.name}>
              <span>{product.tag}</span>
              <h3>{product.name}</h3>
              <strong>{product.price}</strong>
              <p>{product.source}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-preview" id="admin">
        <div>
          <p className="eyebrow">Painel admin</p>
          <h2>Aprovacao antes da publicacao</h2>
          <p>
            A area administrativa futura tera uma aba de produtos recomendados,
            onde voce podera abrir o link original, conferir preco/frete e aprovar
            apenas o que fizer sentido para a FastTrack.
          </p>
        </div>

        <div className="metric-list">
          <div>
            <span className="icon-dot">V</span>
            <span>Vendas</span>
            <strong>Fase futura</strong>
          </div>

          <div>
            <span className="icon-dot">P</span>
            <span>Recomendados</span>
            <strong>Fase scraper</strong>
          </div>
        </div>
      </section>

      <section className="section security" id="seguranca">
        <p className="eyebrow">Seguranca</p>
        <h2>Segredos ficam no backend</h2>
        <p>
          Tokens do Mercado Pago, senha do banco e chaves privadas ficarao na API
          e no `.env` local. O React nunca deve receber esses segredos.
        </p>
      </section>
    </main>
  );
}
