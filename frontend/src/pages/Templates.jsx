import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useGetTemplates from "../hooks/templates/useGetTemplates.js";
import { deleteTemplate } from "../services/template.service.js";
import {
  getCategoryBySlug,
  getLanguageBySlug,
} from "../utils/templateNavigation.js";
import "../styles/templates.css";

function TemplateCard({ template, onDeleted }) {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const formattedDate = new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(template.createdAt));

  const handleDelete = async (event) => {
    event.stopPropagation();

    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar template?",
      text: `Se eliminará "${template.nombre}" de forma permanente.`,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#c23d3d",
      cancelButtonColor: "#66758a",
    });

    if (!result.isConfirmed) {
      return;
    }

    setDeleting(true);

    try {
      await deleteTemplate(template.id);
      await onDeleted();

      await Swal.fire({
        icon: "success",
        title: "Template eliminado",
        text: "El template fue eliminado correctamente.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3157d5",
      });
    } catch {
      await Swal.fire({
        icon: "error",
        title: "No se pudo eliminar",
        text: "Ocurrió un error al eliminar el template.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3157d5",
      });
    } finally {
      setDeleting(false);
    }
  };

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

      <footer className="template-card__footer">
        <time className="template-card__date" dateTime={template.createdAt}>
          Creado el {formattedDate}
        </time>
        <button
          className="template-card__delete-button"
          type="button"
          disabled={deleting}
          onClick={handleDelete}
          onKeyDown={(event) => event.stopPropagation()}
        >
          {deleting ? "Eliminando..." : "Eliminar"}
        </button>
      </footer>
    </article>
  );
}

function Templates() {
  const { lenguaje, categoria } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const language = getLanguageBySlug(lenguaje);
  const category = getCategoryBySlug(language, categoria);
  const { templates, loading, error, refetch } = useGetTemplates({
    lenguaje: language?.name,
    categoria: category?.name,
  });
  const filteredTemplates = templates.filter((template) =>
    template.nombre.toLowerCase().includes(search.trim().toLowerCase()),
  );

  if (!language || !category) {
    return <Navigate to="/" replace />;
  }

  const backPath = language.name === "JavaScript" ? `/${language.slug}` : "/";

  return (
    <main className="templates-page">
      <header className="templates-header">
        <div>
          <button
            className="templates-back-button"
            type="button"
            onClick={() => navigate(backPath)}
          >
            Volver
          </button>
          <p className="templates-header__eyebrow">
            {language.name} / {category.name}
          </p>
          <h1 className="templates-header__title">
            Templates de {category.name}
          </h1>
          <p className="templates-header__description">
            Explora los templates disponibles en esta carpeta.
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

      <div className="templates-search">
        <label htmlFor="template-search">Buscar templates</label>
        <input
          id="template-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nombre..."
        />
      </div>

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

      {!loading && !error && templates.length > 0 && filteredTemplates.length === 0 && (
        <p className="templates-status">
          No se encontraron templates con ese nombre.
        </p>
      )}

      {!loading && !error && filteredTemplates.length > 0 && (
        <section className="templates-grid" aria-label="Lista de templates">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onDeleted={refetch}
            />
          ))}
        </section>
      )}
    </main>
  );
}

export default Templates;
