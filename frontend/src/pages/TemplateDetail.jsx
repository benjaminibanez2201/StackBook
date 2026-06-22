import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import CodeBlock from "../components/CodeBlock.jsx";
import useGetTemplate from "../hooks/templates/useGetTemplate.js";
import { moveTemplateToFolder } from "../services/template.service.js";
import {
  getSubcategories,
  getTemplatePath,
  javascriptCategories,
  languages,
} from "../utils/templateNavigation.js";
import "../styles/templateDetail.css";

function TemplateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { template, loading, error } = useGetTemplate(id);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [isMovePanelOpen, setIsMovePanelOpen] = useState(false);
  const [moveSelection, setMoveSelection] = useState(null);
  const [moving, setMoving] = useState(false);

  const files = Array.isArray(template?.templateFiles)
    ? template.templateFiles
    : [];
  const tags = Array.isArray(template?.tags) ? template.tags : [];
  const activeFile = files[activeFileIndex] ?? files[0] ?? null;
  const templateLanguage =
    languages.find(
      (language) =>
        language.name.toLowerCase() ===
        String(template?.lenguaje ?? "").toLowerCase(),
    )?.name ??
    template?.lenguaje ??
    "JavaScript";
  const templateCategory =
    templateLanguage === "JavaScript"
      ? javascriptCategories.find(
          (category) =>
            category.name.toLowerCase() ===
            String(template?.categoria ?? "").toLowerCase(),
        )?.name ?? "Backend"
      : "General";
  const templateSubcategory =
    getSubcategories(templateLanguage, templateCategory).find(
      (subcategory) =>
        subcategory.toLowerCase() ===
        String(template?.subcategoria ?? "").toLowerCase(),
    ) ??
    template?.subcategoria ??
    "general";
  const currentMoveSelection =
    moveSelection && template && moveSelection.templateId === template.id
      ? moveSelection
      : {
          templateId: template?.id,
          lenguaje: templateLanguage,
          categoria: templateCategory,
          subcategoria: templateSubcategory,
        };
  const moveCategories =
    currentMoveSelection.lenguaje === "JavaScript"
      ? javascriptCategories
      : [{ name: "General", slug: "general" }];
  const moveSubcategories = getSubcategories(
    currentMoveSelection.lenguaje,
    currentMoveSelection.categoria,
  );

  const copyActiveFile = async () => {
    if (!activeFile) {
      return;
    }

    try {
      await navigator.clipboard.writeText(String(activeFile.content ?? ""));
      await Swal.fire({
        icon: "success",
        title: "Contenido copiado",
        text: `${activeFile.fileName ?? "El archivo"} fue copiado al portapapeles.`,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3157d5",
      });
    } catch {
      await Swal.fire({
        icon: "error",
        title: "No se pudo copiar",
        text: "Revisa los permisos del portapapeles e inténtalo nuevamente.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3157d5",
      });
    }
  };

  const handleMoveLanguageChange = (event) => {
    const nextLanguage = event.target.value;
    const nextCategory = nextLanguage === "JavaScript" ? "Backend" : "General";
    const nextSubcategory =
      getSubcategories(nextLanguage, nextCategory)[0] ?? "general";

    setMoveSelection({
      templateId: template?.id,
      lenguaje: nextLanguage,
      categoria: nextCategory,
      subcategoria: nextSubcategory,
    });
  };

  const handleMoveCategoryChange = (event) => {
    const nextCategory = event.target.value;
    const nextSubcategory =
      getSubcategories(currentMoveSelection.lenguaje, nextCategory)[0] ??
      "general";

    setMoveSelection({
      ...currentMoveSelection,
      categoria: nextCategory,
      subcategoria: nextSubcategory,
    });
  };

  const handleMoveTemplate = async (event) => {
    event.preventDefault();

    if (!template) {
      return;
    }

    setMoving(true);

    try {
      await moveTemplateToFolder(template.id, {
        lenguaje: currentMoveSelection.lenguaje,
        categoria: currentMoveSelection.categoria,
        subcategoria: currentMoveSelection.subcategoria,
      });

      await Swal.fire({
        icon: "success",
        title: "Template movido",
        text: "El template fue movido correctamente.",
        confirmButtonText: "Continuar",
        confirmButtonColor: "#3157d5",
      });

      navigate(
        getTemplatePath(
          currentMoveSelection.lenguaje,
          currentMoveSelection.categoria,
          currentMoveSelection.subcategoria,
        ),
      );
    } catch {
      await Swal.fire({
        icon: "error",
        title: "No se pudo mover",
        text: "Intentalo nuevamente en unos segundos.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3157d5",
      });
    } finally {
      setMoving(false);
    }
  };

  if (loading) {
    return (
      <main className="template-detail-page">
        <p className="template-detail-status" role="status">
          Cargando template...
        </p>
      </main>
    );
  }

  if (error || !template) {
    return (
      <main className="template-detail-page">
        <p className="template-detail-status template-detail-status--error" role="alert">
          {error ?? "No se encontró el template."}
        </p>
        <button
          className="template-detail__back-button"
          type="button"
          onClick={() => navigate("/")}
        >
          Volver
        </button>
      </main>
    );
  }

  return (
    <main className="template-detail-page">
      <div className="template-detail-actions">
        <button
          className="template-detail__back-button"
          type="button"
          onClick={() => navigate("/")}
        >
          Volver
        </button>
        <button
          className="template-detail__edit-button"
          type="button"
          onClick={() => navigate(`/templates/${template.id}/edit`)}
        >
          Editar template
        </button>
        <button
          className="template-detail__move-button"
          type="button"
          onClick={() => setIsMovePanelOpen((current) => !current)}
          aria-expanded={isMovePanelOpen}
        >
          Mover
        </button>
      </div>

      {isMovePanelOpen && (
        <form className="template-detail-move" onSubmit={handleMoveTemplate}>
          <div className="template-detail-move__field">
            <label htmlFor="move-language">Lenguaje</label>
            <select
              id="move-language"
              value={currentMoveSelection.lenguaje}
              onChange={handleMoveLanguageChange}
              disabled={moving}
            >
              {languages.map((language) => (
                <option value={language.name} key={language.slug}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>

          <div className="template-detail-move__field">
            <label htmlFor="move-category">Categoria</label>
            <select
              id="move-category"
              value={currentMoveSelection.categoria}
              onChange={handleMoveCategoryChange}
              disabled={moving}
            >
              {moveCategories.map((category) => (
                <option value={category.name} key={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="template-detail-move__field">
            <label htmlFor="move-subcategory">Subcategoria</label>
            <select
              id="move-subcategory"
              value={currentMoveSelection.subcategoria}
              onChange={(event) =>
                setMoveSelection({
                  ...currentMoveSelection,
                  subcategoria: event.target.value,
                })
              }
              disabled={moving}
            >
              {moveSubcategories.map((subcategory) => (
                <option value={subcategory} key={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </div>

          <button
            className="template-detail-move__submit"
            type="submit"
            disabled={moving}
          >
            {moving ? "Moviendo..." : "Mover template"}
          </button>
        </form>
      )}

      <header className="template-detail-header">
        <div className="template-detail-header__main">
          <p className="template-detail-header__eyebrow">
            Detalle del template
          </p>
          <h1 className="template-detail-header__title">{template.nombre}</h1>
          <p className="template-detail-header__description">
            {template.descripcion}
          </p>

          {tags.length > 0 && (
            <div className="template-detail-tags" aria-label="Etiquetas">
              {tags.map((tag) => (
                <span className="template-detail-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <dl className="template-detail-meta">
          <div>
            <dt>Lenguaje</dt>
            <dd>{template.lenguaje ?? "Sin lenguaje"}</dd>
          </div>
          <div>
            <dt>Categoría</dt>
            <dd>{template.categoria ?? "Sin categoria"}</dd>
          </div>
          <div>
            <dt>Subcategoría</dt>
            <dd>{template.subcategoria ?? "Sin subcategoria"}</dd>
          </div>
          <div>
            <dt>Archivos</dt>
            <dd>{files.length}</dd>
          </div>
        </dl>
      </header>

      <section className="template-detail-files" aria-labelledby="files-title">
        <div className="template-detail-files__heading">
          <div>
            <p className="template-detail-files__eyebrow">Código fuente</p>
            <h2 id="files-title">Archivos</h2>
          </div>

          {activeFile && (
            <button
              className="template-detail__copy-button"
              type="button"
              onClick={copyActiveFile}
            >
              Copiar
            </button>
          )}
        </div>

        {files.length === 0 ? (
          <p className="template-detail-files__empty">
            Este template no contiene archivos.
          </p>
        ) : (
          <>
            <div className="template-detail-tabs" role="tablist">
              {files.map((file, index) => {
                const isActive = activeFile?.id === file.id;

                return (
                  <button
                    className={`template-detail-tab${
                      isActive ? " template-detail-tab--active" : ""
                    }`}
                    id={`file-tab-${file.id ?? index}`}
                    key={file.id ?? index}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`file-panel-${file.id ?? index}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveFileIndex(index)}
                  >
                    {file.fileName ?? `Archivo ${index + 1}`}
                  </button>
                );
              })}
            </div>

            <div
              className="template-detail-code"
              id={`file-panel-${activeFile.id ?? activeFileIndex}`}
              role="tabpanel"
              aria-labelledby={`file-tab-${activeFile.id ?? activeFileIndex}`}
            >
              <div className="template-detail-code__header">
                <div className="template-detail-code__window">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="template-detail-code__filename">
                  {activeFile.fileName ?? "archivo"}
                </span>
                <span className="template-detail-code__type">
                  {String(activeFile.type ?? "txt").toUpperCase()}
                </span>
              </div>
              <CodeBlock content={String(activeFile.content ?? "")} />
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default TemplateDetail;
