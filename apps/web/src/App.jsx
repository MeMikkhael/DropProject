import React, { useEffect, useState } from "react";
import { Admin } from "./pages/Admin.jsx";

// URL padrão do backend para não quebrar se a variável de ambiente não existir
const DEFAULT_API_URL = "http://localhost:3000";

// Faz uma requisição e transforma a resposta em JSON.
async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

// Função para montar a mensagem do status da API
function getOverviewStatus(overview, loading, error) {
  if (loading) {
    return "Conectando ao backend...";
  }

  if (error) {
    return error;
  }

  return `${overview?.market ?? "Brasil"} · ${overview?.currency ?? "BRL"}`;
}

// Função para montar o resumo de pagamento vindo do backend
function getPaymentSummary(overview) {
  if (!overview) {
    return "Produtos recomendados por scraper com aprovacao manual";
  }

  return `${overview.paymentProvider} · ${overview.phase}`;
}

// Componente principal da aplicação
export function App() {
  // A rota do painel e separada da pagina publica da loja.
  if (window.location.pathname === "/admin") {
    return <Admin />;
  }

  // Estado para guardar os dados do backend
  const [overview, setOverview] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState("");
  const [productsError, setProductsError] = useState("");

  // Busca a overview e, depois que ela chega, busca os produtos.
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL ?? DEFAULT_API_URL;

    async function loadData() {
      try {
        const overviewData = await fetchJson(`${apiUrl}/api/overview`);

        setOverview(overviewData);
        setLoading(false);

        // Este segundo fetch só começa depois que a overview foi carregada.
        try {
          const productsData = await fetchJson(`${apiUrl}/api/products`);

          setProducts(Array.isArray(productsData) ? productsData : []);
        } catch {
          setProductsError("Não foi possível carregar os produtos.");
        } finally {
          setProductsLoading(false);
        }
      } catch {
        setError("Não foi possível conectar com a API.");
        setLoading(false);
        setProductsLoading(false);
      }
    }

    loadData();
  }, []);

  // Mensagens prontas para exibir na tela
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
          <a href="/admin">Admin</a>
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
            <a className="secondary-action" href="/admin">
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
          <h2>Produtos da loja</h2>
        </div>

        <div className="product-grid">
          {productsLoading && <p>Carregando produtos...</p>}

          {!productsLoading && productsError && <p>{productsError}</p>}

          {!productsLoading && !productsError && products.length === 0 && (
            <p>Nenhum produto cadastrado ainda.</p>
          )}

          {!productsLoading &&
            !productsError &&
            products.map((product, index) => (
              <article
                className="product-card"
                key={product.id ?? product.name ?? index}
              >
                <span>{product.tag ?? "Produto"}</span>
                <h3>{product.name ?? product.title ?? "Produto sem nome"}</h3>
                <strong>{product.price ?? "Preço não informado"}</strong>
                <p>
                  {product.description ??
                    product.source ??
                    "Cadastro no banco de dados"}
                </p>
              </article>
            ))}
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
