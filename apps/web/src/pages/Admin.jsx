import React, { useEffect, useState } from "react";

const DEFAULT_API_URL = "http://localhost:3000";
const EMPTY_FORM = {
  name: "",
  description: "",
  supplier_url: "",
  supplier_price: "",
  shipping_cost: "",
  additional_costs: "",
  suggested_price: "",
  image_url: "",
  margin_percent: "30"
};

export function Admin() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [actionError, setActionError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL ?? DEFAULT_API_URL;

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const response = await fetch(`${apiUrl}/api/recommendations`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        setRecommendations(Array.isArray(data) ? data : []);
      } catch (requestError) {
        console.error("Erro ao carregar recomendações:", requestError);
        setError("Não foi possível carregar as recomendações.");
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, [apiUrl]);

  function handleFormChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  }

  async function handleCreateRecommendation(event) {
    event.preventDefault();
    setSaving(true);
    setActionError("");

    try {
      const response = await fetch(`${apiUrl}/api/recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          supplier_price: form.supplier_price || null,
          shipping_cost: form.shipping_cost || null,
          suggested_price: form.suggested_price
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Não foi possível cadastrar a recomendação.");
      }

      setRecommendations((currentRecommendations) => [
        data,
        ...currentRecommendations
      ]);
      setForm(EMPTY_FORM);
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDecision(id, decision) {
    setActionLoading(`${id}-${decision}`);
    setActionError("");

    try {
      const response = await fetch(
        `${apiUrl}/api/recommendations/${id}/${decision}`,
        { method: "POST" }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Não foi possível atualizar a recomendação.");
      }

      setRecommendations((currentRecommendations) =>
        currentRecommendations.filter((recommendation) => recommendation.id !== id)
      );
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setActionLoading("");
    }
  }

  async function handleImportDemo() {
    setSaving(true);
    setActionError("");

    try {
      const response = await fetch(
        `${apiUrl}/api/recommendations/import/mercado-livre`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            margin_percent: Number(form.margin_percent) || 30
          })
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Não foi possível importar os exemplos.");
      }

      setRecommendations((currentRecommendations) => [
        ...data.created,
        ...currentRecommendations
      ]);
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Carregando recomendações...</p>;
  }

  return (
    <section className="admin-page" aria-labelledby="admin-title">
      <div className="admin-header">
        <div>
          <a className="back-link" href="/">Voltar para a loja</a>
          <p className="eyebrow">Central de curadoria</p>
          <h1 id="admin-title">Painel administrativo</h1>
          <p className="admin-intro">
            Revise produtos encontrados, ajuste os custos e publique somente o
            que fizer sentido para a FastTrack.
          </p>
        </div>

        <div className="admin-stat">
          <span>Pendentes</span>
          <strong>{recommendations.length}</strong>
          <small>limite de 100</small>
        </div>
      </div>

      <div className="admin-grid">
        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Entrada de dados</p>
              <h2>Cadastrar recomendação</h2>
            </div>
            <span className="panel-mark">01</span>
          </div>

          <form className="admin-form" onSubmit={handleCreateRecommendation}>
            <label>
              Produto
              <input
                name="name"
                onChange={handleFormChange}
                placeholder="Nome do produto"
                required
                value={form.name}
              />
            </label>

            <label>
              Link do fornecedor
              <input
                name="supplier_url"
                onChange={handleFormChange}
                placeholder="https://..."
                type="url"
                value={form.supplier_url}
              />
            </label>

            <div className="form-row">
              <label>
                Custo do produto
                <input
                  name="supplier_price"
                  onChange={handleFormChange}
                  placeholder="0,00"
                  required
                  step="0.01"
                  type="number"
                  value={form.supplier_price}
                />
              </label>

              <label>
                Frete
                <input
                  name="shipping_cost"
                  onChange={handleFormChange}
                  placeholder="0,00"
                  step="0.01"
                  type="number"
                  value={form.shipping_cost}
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                Outros custos
                <input
                  name="additional_costs"
                  onChange={handleFormChange}
                  placeholder="0,00"
                  step="0.01"
                  type="number"
                  value={form.additional_costs}
                />
              </label>

              <label>
                Margem (%)
                <input
                  name="margin_percent"
                  onChange={handleFormChange}
                  min="0"
                  step="0.1"
                  type="number"
                  value={form.margin_percent}
                />
              </label>

            </div>

            <label>
              Preço sugerido manual
              <input
                name="suggested_price"
                onChange={handleFormChange}
                placeholder="Deixe vazio para calcular automaticamente"
                step="0.01"
                type="number"
                value={form.suggested_price}
              />
            </label>

            <label>
              Descrição
              <textarea
                name="description"
                onChange={handleFormChange}
                placeholder="Resumo do produto e dos seus diferenciais"
                value={form.description}
              />
            </label>

            <div className="form-actions">
              <button className="admin-button primary" disabled={saving} type="submit">
                {saving ? "Salvando..." : "Cadastrar recomendação"}
              </button>
              <button
                className="admin-button secondary"
                disabled={saving}
                onClick={handleImportDemo}
                type="button"
              >
                Importar exemplos ML
              </button>
            </div>
          </form>
        </section>

        <aside className="admin-panel admin-help">
          <p className="eyebrow">Como funciona</p>
          <h2>Curadoria antes da vitrine</h2>
          <p>
            Os exemplos simulam a futura integração com a API do Mercado Livre.
            Eles entram como pendentes e só chegam à loja depois da sua aprovação.
          </p>
          <div className="workflow-list">
            <span><b>01</b> Coletar</span>
            <span><b>02</b> Conferir</span>
            <span><b>03</b> Publicar</span>
          </div>
        </aside>
      </div>

      {actionError && <p className="admin-alert">{actionError}</p>}

      <section className="recommendations-section">
        <div className="section-heading admin-list-heading">
          <div>
            <p className="eyebrow">Fila de revisão</p>
            <h2>Recomendações pendentes</h2>
          </div>
          <span className="queue-label">{recommendations.length} itens</span>
        </div>

        {error ? (
          <p className="admin-alert">{error}</p>
        ) : recommendations.length === 0 ? (
          <p className="empty-state">Nenhuma recomendação pendente.</p>
        ) : (
          <div className="recommendation-list">
            {recommendations.map((recommendation) => (
              <article className="recommendation-card" key={recommendation.id}>
                <div className="recommendation-header">
                  <div>
                    <span className="source-badge">
                      {recommendation.source ?? "MANUAL"}
                    </span>
                    <h3>{recommendation.name}</h3>
                  </div>
                  <span className="recommendation-status">PENDENTE</span>
                </div>

                <p className="recommendation-description">
                  {recommendation.description ?? "Sem descrição informada."}
                </p>

                <div className="recommendation-data">
                  <div>
                    <span>Custo</span>
                    <strong>R$ {Number(recommendation.supplier_price).toFixed(2)}</strong>
                  </div>
                  <div>
                    <span>Frete</span>
                    <strong>R$ {Number(recommendation.shipping_cost).toFixed(2)}</strong>
                  </div>
                  <div>
                    <span>Margem</span>
                    <strong>{recommendation.margin_percent ?? "-"}%</strong>
                  </div>
                  <div className="highlight">
                    <span>Sugerido</span>
                    <strong>R$ {Number(recommendation.suggested_price).toFixed(2)}</strong>
                  </div>
                </div>

                <div className="recommendation-footer">
                  <span>Estoque: {recommendation.stock ?? "não informado"}</span>
                  <div className="form-actions">
                    <button
                      className="admin-button approve"
                      disabled={actionLoading !== ""}
                      onClick={() => handleDecision(recommendation.id, "approve")}
                      type="button"
                    >
                      {actionLoading === `${recommendation.id}-approve`
                        ? "Aprovando..."
                        : "Aprovar"}
                    </button>
                    <button
                      className="admin-button reject"
                      disabled={actionLoading !== ""}
                      onClick={() => handleDecision(recommendation.id, "reject")}
                      type="button"
                    >
                      {actionLoading === `${recommendation.id}-reject`
                        ? "Rejeitando..."
                        : "Rejeitar"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}