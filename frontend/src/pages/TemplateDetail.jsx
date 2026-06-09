import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useGetTemplate from "../hooks/templates/useGetTemplate.js";
import "../styles/templateDetail.css";

function TemplateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { template, loading, error } = useGetTemplate(id);
  const [activeFileIndex, setActiveFileIndex] = useState(0);

  const files = template?.templateFiles ?? [];
  const activeFile = files[activeFileIndex] ?? files[0];

  const copyActiveFile = async () => {
    if (!activeFile) {
      return;
    }

    try {
      await navigator.clipboard.writeText(activeFile.content);
      await Swal.fire({
        icon: "success",
        title: "Contenido copiado",
        text: `${activeFile.fileName} fue copiado al portapapeles.`,
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
      <button
        className="template-detail__back-button"
        type="button"
        onClick={() => navigate("/")}
      >
        Volver
      </button>

      <header className="template-detail-header">
        <p className="template-detail-header__eyebrow">Detalle del template</p>
        <h1 className="template-detail-header__title">{template.nombre}</h1>
        <p className="template-detail-header__description">
          {template.descripcion}
        </p>

        {template.tags?.length > 0 && (
          <div className="template-detail-tags" aria-label="Etiquetas">
            {template.tags.map((tag) => (
              <span className="template-detail-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
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
                    id={`file-tab-${file.id}`}
                    key={file.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`file-panel-${file.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveFileIndex(index)}
                  >
                    {file.fileName}
                  </button>
                );
              })}
            </div>

            <div
              className="template-detail-code"
              id={`file-panel-${activeFile.id}`}
              role="tabpanel"
              aria-labelledby={`file-tab-${activeFile.id}`}
            >
              <div className="template-detail-code__header">
                <span>{activeFile.fileName}</span>
                <span>{activeFile.type.toUpperCase()}</span>
              </div>
              <pre>
                <code>{activeFile.content}</code>
              </pre>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default TemplateDetail;
