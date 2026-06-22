import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getTemplateCounts } from "../services/template.service.js";
import {
  getCategoryBySlug,
  getLanguageBySlug,
  getSubcategories,
  javascriptCategories,
} from "../utils/templateNavigation.js";
import "../styles/folderNavigation.css";

function Categories() {
  const { lenguaje, categoria } = useParams();
  const navigate = useNavigate();
  const language = getLanguageBySlug(lenguaje);
  const category = getCategoryBySlug(language, categoria);
  const [counts, setCounts] = useState([]);

  useEffect(() => {
    let cancelled = false;

    getTemplateCounts()
      .then((response) => {
        if (!cancelled) {
          setCounts(response.data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCounts([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!language) {
    return <Navigate to="/" replace />;
  }

  if (categoria && !category) {
    return <Navigate to={`/${language.slug}`} replace />;
  }

  if (language.name !== "JavaScript") {
    return <Navigate to={`/${language.slug}/general/general`} replace />;
  }

  const items = category
    ? getSubcategories(language.name, category.name).map((subcategory) => ({
        name: subcategory,
        slug: subcategory,
      }))
    : javascriptCategories;
  const backPath = category ? `/${language.slug}` : "/";

  return (
    <main className="folder-page">
      <button
        className="folder-back-button"
        type="button"
        onClick={() => navigate(backPath)}
      >
        Volver
      </button>

      <header className="folder-header">
        <p className="folder-header__eyebrow">
          {category ? `${language.name} / ${category.name}` : language.name}
        </p>
        <h1 className="folder-header__title">
          {category ? "Subcategorías" : "Categorías"}
        </h1>
        <p className="folder-header__description">
          Selecciona la carpeta que quieres explorar.
        </p>
      </header>

      <section className="folder-grid" aria-label="Carpetas disponibles">
        {items.map((item) => {
          const total = counts.reduce((sum, count) => {
            const matchesLanguage = count.lenguaje === language.name;
            const matchesFolder = category
              ? count.categoria === category.name &&
                count.subcategoria === item.name
              : count.categoria === item.name;

            return matchesLanguage && matchesFolder ? sum + count.total : sum;
          }, 0);

          return (
            <button
              className="folder-card"
              type="button"
              key={item.slug}
              onClick={() =>
                navigate(
                  category
                    ? `/${language.slug}/${category.slug}/${item.slug}`
                    : `/${language.slug}/${item.slug}`,
                )
              }
            >
              <span className="folder-card__icon" aria-hidden="true">
                {item.name.slice(0, 2)}
              </span>
              <span>
                <strong className="folder-card__title folder-card__title--capitalize">
                  {item.name}
                </strong>
                <span className="folder-card__description">
                  {category ? "Ver templates" : "Explorar subcategorías"}
                </span>
              </span>
              <span
                className="folder-card__badge"
                aria-label={`${total} templates`}
              >
                {total}
              </span>
              <span className="folder-card__arrow" aria-hidden="true">
                →
              </span>
            </button>
          );
        })}
      </section>
    </main>
  );
}

export default Categories;
