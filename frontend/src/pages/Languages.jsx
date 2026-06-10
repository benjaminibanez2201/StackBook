import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchTemplates } from "../services/template.service.js";
import { languages } from "../utils/templateNavigation.js";
import "../styles/folderNavigation.css";
import "../styles/languages.css";

function Languages() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
      return undefined;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(async () => {
      setLoading(true);
      setHasSearched(false);

      try {
        const response = await searchTemplates(normalizedQuery);

        if (!cancelled) {
          setResults(response.data);
          setHasSearched(true);
        }
      } catch {
        if (!cancelled) {
          setResults([]);
          setHasSearched(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    const closeSearch = (event) => {
      if (!event.target.closest(".language-search")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeSearch);
    return () => document.removeEventListener("mousedown", closeSearch);
  }, []);

  const handleQueryChange = (event) => {
    const value = event.target.value;
    const hasMinimumLength = value.trim().length >= 2;

    setQuery(value);
    setResults([]);
    setLoading(false);
    setHasSearched(false);
    setIsOpen(hasMinimumLength);
  };

  return (
    <main className="folder-page">
      <header className="folder-header">
        <p className="folder-header__eyebrow">Biblioteca</p>
        <h1 className="folder-header__title">Lenguajes</h1>
        <p className="folder-header__description">
          Selecciona un lenguaje para explorar sus templates.
        </p>
      </header>

      <div className="language-search">
        <label htmlFor="global-template-search">Buscar templates</label>
        <input
          id="global-template-search"
          type="search"
          value={query}
          placeholder="Busca por nombre, tag, lenguaje o categoría..."
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="global-search-results"
          onChange={handleQueryChange}
          onFocus={() => {
            if (query.trim().length >= 2) {
              setIsOpen(true);
            }
          }}
        />

        {isOpen && (
          <div
            className="language-search__dropdown"
            id="global-search-results"
            role="listbox"
          >
            {loading && (
              <p className="language-search__status">Buscando templates...</p>
            )}

            {!loading && hasSearched && results.length === 0 && (
              <p className="language-search__status">
                No se encontraron templates
              </p>
            )}

            {!loading &&
              results.map((template) => (
                <button
                  className="language-search__result"
                  type="button"
                  role="option"
                  key={template.id}
                  onClick={() => navigate(`/templates/${template.id}`)}
                >
                  <strong>{template.nombre}</strong>
                  <span>
                    {template.lenguaje} / {template.categoria} /{" "}
                    {template.subcategoria}
                  </span>
                </button>
              ))}
          </div>
        )}
      </div>

      <section className="folder-grid" aria-label="Lenguajes disponibles">
        {languages.map((language) => (
          <button
            className="folder-card"
            type="button"
            key={language.slug}
            onClick={() => navigate(`/${language.slug}`)}
          >
            <span className="folder-card__icon">
              <img
                src={`https://skillicons.dev/icons?i=${language.icon}`}
                alt={`Icono de ${language.name}`}
                width="40"
                height="40"
              />
            </span>
            <span>
              <strong className="folder-card__title">{language.name}</strong>
              <span className="folder-card__description">
                Explorar templates
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

export default Languages;
