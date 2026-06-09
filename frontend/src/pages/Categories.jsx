import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  getLanguageBySlug,
  javascriptCategories,
} from "../utils/templateNavigation.js";
import "../styles/folderNavigation.css";

function Categories() {
  const { lenguaje } = useParams();
  const navigate = useNavigate();
  const language = getLanguageBySlug(lenguaje);

  if (!language) {
    return <Navigate to="/" replace />;
  }

  if (language.name !== "JavaScript") {
    return <Navigate to={`/${language.slug}/general`} replace />;
  }

  return (
    <main className="folder-page">
      <button
        className="folder-back-button"
        type="button"
        onClick={() => navigate("/")}
      >
        Volver
      </button>

      <header className="folder-header">
        <p className="folder-header__eyebrow">{language.name}</p>
        <h1 className="folder-header__title">Categorías</h1>
        <p className="folder-header__description">
          Selecciona el tipo de proyecto que quieres explorar.
        </p>
      </header>

      <section className="folder-grid" aria-label="Categorías disponibles">
        {javascriptCategories.map((category) => (
          <button
            className="folder-card"
            type="button"
            key={category.slug}
            onClick={() => navigate(`/${language.slug}/${category.slug}`)}
          >
            <span className="folder-card__icon" aria-hidden="true">
              {category.name.slice(0, 2)}
            </span>
            <span>
              <strong className="folder-card__title">{category.name}</strong>
              <span className="folder-card__description">
                Ver templates de {category.name.toLowerCase()}
              </span>
            </span>
            <span className="folder-card__arrow" aria-hidden="true">
              →
            </span>
          </button>
        ))}
      </section>
    </main>
  );
}

export default Categories;
