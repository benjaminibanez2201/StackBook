import { useNavigate } from "react-router-dom";
import { languages } from "../utils/templateNavigation.js";
import "../styles/folderNavigation.css";

function Languages() {
  const navigate = useNavigate();

  return (
    <main className="folder-page">
      <header className="folder-header">
        <p className="folder-header__eyebrow">Biblioteca</p>
        <h1 className="folder-header__title">Lenguajes</h1>
        <p className="folder-header__description">
          Selecciona un lenguaje para explorar sus templates.
        </p>
      </header>

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
