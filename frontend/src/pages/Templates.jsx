import { useNavigate } from "react-router-dom";
import useGetTemplates from "../hooks/templates/useGetTemplates.js";
import "../styles/templates.css";

function TemplateCard({ template }) {
  const navigate = useNavigate();
  const formattedDate = new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(template.createdAt));

  return (
    <article
      className="template-card"
      role="link"
      tabIndex={0}
      onClick={() => navigate(`/templates/${template.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(`/templates/${template.id}`);
        }
      }}
    >
      <div className="template-card__content">
        <h2 className="template-card__title">{template.nombre}</h2>
        <p className="template-card__description">{template.descripcion}</p>

        <div className="template-card__tags" aria-label="Etiquetas">
          {template.tags.map((tag) => (
            <span className="template-card__tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <time className="template-card__date" dateTime={template.createdAt}>
        Creado el {formattedDate}
      </time>
    </article>
  );
}

function Templates() {
  const navigate = useNavigate();
  const { templates, loading, error } = useGetTemplates();

  return (
    <main className="templates-page">
      <header className="templates-header">
        <div>
          <p className="templates-header__eyebrow">Biblioteca</p>
          <h1 className="templates-header__title">Templates</h1>
          <p className="templates-header__description">
            Explora y administra tus templates disponibles.
          </p>
        </div>

        <button
          className="templates-header__button"
          type="button"
          onClick={() => navigate("/create")}
        >
          Nuevo template
        </button>
      </header>

      {loading && (
        <p className="templates-status" role="status">
          Cargando templates...
        </p>
      )}

      {error && (
        <p className="templates-status templates-status--error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && templates.length === 0 && (
        <p className="templates-status">
          Aún no hay templates. Crea el primero para comenzar.
        </p>
      )}

      {!loading && !error && templates.length > 0 && (
        <section className="templates-grid" aria-label="Lista de templates">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </section>
      )}
    </main>
  );
}

export default Templates;
