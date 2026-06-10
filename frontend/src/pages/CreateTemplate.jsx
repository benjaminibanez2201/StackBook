import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useCreateTemplate from "../hooks/templates/useCreateTemplate.js";
import {
  getSubcategories,
  getTemplatePath,
  languages,
} from "../utils/templateNavigation.js";
import "../styles/createTemplate.css";

const emptyFile = () => ({
  id: crypto.randomUUID(),
  fileName: "",
  type: "jsx",
  content: "",
});

const fileTypes = [
  { value: "js", label: "JavaScript" },
  { value: "jsx", label: "JSX" },
  { value: "ts", label: "TypeScript" },
  { value: "tsx", label: "TSX" },
  { value: "css", label: "CSS" },
  { value: "html", label: "HTML" },
  { value: "json", label: "JSON" },
  { value: "py", label: "Python" },
  { value: "java", label: "Java" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "h", label: "Header C/C++" },
  { value: "cs", label: "C#" },
  { value: "sql", label: "SQL" },
  { value: "md", label: "Markdown" },
  { value: "yaml", label: "YAML" },
  { value: "xml", label: "XML" },
  { value: "sh", label: "Shell" },
];

function validateForm({
  nombre,
  descripcion,
  lenguaje,
  categoria,
  subcategoria,
  tags,
  files,
}) {
  const errors = {};

  if (!nombre.trim()) {
    errors.nombre = "El nombre es obligatorio.";
  } else if (nombre.trim().length < 3) {
    errors.nombre = "El nombre debe tener al menos 3 caracteres.";
  } else if (nombre.trim().length > 50) {
    errors.nombre = "El nombre no puede superar los 50 caracteres.";
  }

  if (!descripcion.trim()) {
    errors.descripcion = "La descripción es obligatoria.";
  }

  if (!lenguaje) {
    errors.lenguaje = "El lenguaje es obligatorio.";
  }

  if (!categoria) {
    errors.categoria = "La categoría es obligatoria.";
  }

  if (!subcategoria.trim()) {
    errors.subcategoria = "La subcategoría es obligatoria.";
  } else if (
    !getSubcategories(lenguaje, categoria).includes(
      subcategoria.trim().toLowerCase(),
    )
  ) {
    errors.subcategoria = "Selecciona una subcategoría válida.";
  }

  if (tags.length === 0) {
    errors.tags = "Agrega al menos un tag.";
  }

  if (files.length === 0) {
    errors.files = "Agrega al menos un archivo.";
  } else {
    const fileErrors = files.map((file) => ({
      fileName: file.fileName.trim() ? "" : "El nombre es obligatorio.",
      type: file.type.trim() ? "" : "El tipo es obligatorio.",
      content: file.content.trim() ? "" : "El contenido es obligatorio.",
    }));

    if (fileErrors.some((file) => Object.values(file).some(Boolean))) {
      errors.fileItems = fileErrors;
    }
  }

  return errors;
}

export function TemplateForm({
  initialTemplate = null,
  submitTemplate,
  loading,
  error,
  isEditing = false,
}) {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState(initialTemplate?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(
    initialTemplate?.descripcion ?? "",
  );
  const [lenguaje, setLenguaje] = useState(
    initialTemplate?.lenguaje ?? "JavaScript",
  );
  const [categoria, setCategoria] = useState(
    initialTemplate?.categoria ?? "Backend",
  );
  const [subcategoria, setSubcategoria] = useState(
    initialTemplate?.subcategoria ?? "controllers",
  );
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(initialTemplate?.tags ?? []);
  const [files, setFiles] = useState(() => {
    const initialFiles = initialTemplate?.templateFiles ?? [];

    if (initialFiles.length === 0) {
      return [emptyFile()];
    }

    return initialFiles.map((file) => ({
      id: `existing-${file.id}`,
      fileName: file.fileName,
      type: file.type,
      content: file.content,
    }));
  });
  const [validationErrors, setValidationErrors] = useState({});
  const subcategoryOptions = getSubcategories(lenguaje, categoria);

  const addTag = () => {
    const newTag = tagInput.trim();

    if (!newTag) {
      setValidationErrors((current) => ({
        ...current,
        tags: "Escribe un tag antes de agregarlo.",
      }));
      return;
    }

    if (tags.some((tag) => tag.toLowerCase() === newTag.toLowerCase())) {
      setValidationErrors((current) => ({
        ...current,
        tags: "Ese tag ya fue agregado.",
      }));
      return;
    }

    setTags((current) => [...current, newTag]);
    setTagInput("");
    setValidationErrors((current) => ({ ...current, tags: "" }));
  };

  const handleTagKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag();
    }
  };

  const removeTag = (tagToRemove) => {
    setTags((current) => current.filter((tag) => tag !== tagToRemove));
  };

  const updateFile = (id, field, value) => {
    setFiles((current) =>
      current.map((file) =>
        file.id === id ? { ...file, [field]: value } : file,
      ),
    );
  };

  const removeFile = (id) => {
    setFiles((current) => current.filter((file) => file.id !== id));
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    const selectedCategory =
      selectedLanguage === "JavaScript" ? "Backend" : "General";
    setLenguaje(selectedLanguage);
    setCategoria(selectedCategory);
    setSubcategoria(
      getSubcategories(selectedLanguage, selectedCategory)[0] ?? "general",
    );
  };

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setCategoria(selectedCategory);
    setSubcategoria(
      getSubcategories(lenguaje, selectedCategory)[0] ?? "general",
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      nombre,
      descripcion,
      lenguaje,
      categoria,
      subcategoria,
      tags,
      files,
    };
    const newErrors = validateForm(formData);
    setValidationErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const savedTemplate = await submitTemplate({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      lenguaje,
      categoria,
      subcategoria: subcategoria.trim().toLowerCase(),
      tags,
      files: files.map(({ fileName, type, content }) => ({
        fileName: fileName.trim(),
        type: type.trim(),
        content,
      })),
    });

    if (!savedTemplate) {
      return;
    }

    await Swal.fire({
      icon: "success",
      title: isEditing ? "Template actualizado" : "Template guardado",
      text: isEditing
        ? "El template fue actualizado correctamente."
        : "El template fue creado correctamente.",
      confirmButtonText: "Continuar",
      confirmButtonColor: "#3157d5",
    });

    navigate(
      isEditing
        ? `/templates/${initialTemplate.id}`
        : getTemplatePath(lenguaje, categoria, subcategoria),
    );
  };

  return (
    <main className="create-template-page">
      <header className="create-template-header">
        <p className="create-template-header__eyebrow">
          {isEditing ? "Editar recurso" : "Nuevo recurso"}
        </p>
        <h1 className="create-template-header__title">
          {isEditing ? "Editar template" : "Crear template"}
        </h1>
        <p className="create-template-header__description">
          Define la información, etiquetas y archivos que formarán tu template.
        </p>
      </header>

      <form className="template-form" onSubmit={handleSubmit} noValidate>
        <section className="template-form__section">
          <div className="template-form__section-heading">
            <span className="template-form__step">01</span>
            <div>
              <h2>Información general</h2>
              <p>Datos principales para identificar el template.</p>
            </div>
          </div>

          <div className="template-form__field">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={nombre}
              maxLength={50}
              onChange={(event) => setNombre(event.target.value)}
              aria-invalid={Boolean(validationErrors.nombre)}
              aria-describedby={
                validationErrors.nombre ? "nombre-error" : undefined
              }
              placeholder="Ej. Dashboard administrativo"
            />
            {validationErrors.nombre && (
              <p className="template-form__error" id="nombre-error">
                {validationErrors.nombre}
              </p>
            )}
          </div>

          <div className="template-form__field">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={descripcion}
              rows={5}
              onChange={(event) => setDescripcion(event.target.value)}
              aria-invalid={Boolean(validationErrors.descripcion)}
              aria-describedby={
                validationErrors.descripcion
                  ? "descripcion-error"
                  : undefined
              }
              placeholder="Describe brevemente el propósito del template"
            />
            {validationErrors.descripcion && (
              <p className="template-form__error" id="descripcion-error">
                {validationErrors.descripcion}
              </p>
            )}
          </div>

          <div className="template-form__select-row">
            <div className="template-form__field">
              <label htmlFor="lenguaje">Lenguaje</label>
              <select
                id="lenguaje"
                name="lenguaje"
                value={lenguaje}
                onChange={handleLanguageChange}
                required
                aria-invalid={Boolean(validationErrors.lenguaje)}
              >
                {languages.map((language) => (
                  <option value={language.name} key={language.slug}>
                    {language.name}
                  </option>
                ))}
              </select>
              {validationErrors.lenguaje && (
                <p className="template-form__error">
                  {validationErrors.lenguaje}
                </p>
              )}
            </div>

            <div className="template-form__field">
              <label htmlFor="categoria">Categoría</label>
              <select
                id="categoria"
                name="categoria"
                value={categoria}
                onChange={handleCategoryChange}
                required
                aria-invalid={Boolean(validationErrors.categoria)}
              >
                {lenguaje === "JavaScript" ? (
                  <>
                    <option value="Backend">Backend</option>
                    <option value="Frontend">Frontend</option>
                  </>
                ) : (
                  <option value="General">General</option>
                )}
              </select>
              {validationErrors.categoria && (
                <p className="template-form__error">
                  {validationErrors.categoria}
                </p>
              )}
            </div>
          </div>

          {lenguaje === "JavaScript" && (
            <div className="template-form__field template-form__subcategory">
              <label htmlFor="subcategoria">Subcategoría</label>
              <input
                id="subcategoria"
                name="subcategoria"
                type="text"
                list="subcategorias"
                value={subcategoria}
                onChange={(event) => setSubcategoria(event.target.value)}
                required
                aria-invalid={Boolean(validationErrors.subcategoria)}
                placeholder="Selecciona o escribe una subcategoría"
              />
              <datalist id="subcategorias">
                {subcategoryOptions.map((option) => (
                  <option value={option} key={option} />
                ))}
              </datalist>
              {validationErrors.subcategoria && (
                <p className="template-form__error">
                  {validationErrors.subcategoria}
                </p>
              )}
            </div>
          )}
        </section>

        <section className="template-form__section">
          <div className="template-form__section-heading">
            <span className="template-form__step">02</span>
            <div>
              <h2>Tags</h2>
              <p>Agrega palabras clave para organizar el template.</p>
            </div>
          </div>

          <div className="template-form__field">
            <label htmlFor="tag">Nuevo tag</label>
            <div className="template-form__inline-field">
              <input
                id="tag"
                type="text"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={handleTagKeyDown}
                aria-invalid={Boolean(validationErrors.tags)}
                aria-describedby={
                  validationErrors.tags ? "tags-error" : undefined
                }
                placeholder="Ej. React"
              />
              <button
                className="template-form__secondary-button"
                type="button"
                onClick={addTag}
              >
                Agregar
              </button>
            </div>

            {tags.length > 0 && (
              <div className="template-form__tags" aria-label="Tags agregados">
                {tags.map((tag) => (
                  <span className="template-form__tag" key={tag}>
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      aria-label={`Eliminar tag ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {validationErrors.tags && (
              <p className="template-form__error" id="tags-error">
                {validationErrors.tags}
              </p>
            )}
          </div>
        </section>

        <section className="template-form__section">
          <div className="template-form__section-heading template-form__section-heading--actions">
            <div className="template-form__section-title">
              <span className="template-form__step">03</span>
              <div>
                <h2>Archivos</h2>
                <p>Incluye el código que formará parte del template.</p>
              </div>
            </div>

            <button
              className="template-form__secondary-button"
              type="button"
              onClick={() => setFiles((current) => [...current, emptyFile()])}
            >
              Agregar archivo
            </button>
          </div>

          {validationErrors.files && (
            <p className="template-form__error">{validationErrors.files}</p>
          )}

          <div className="template-files">
            {files.map((file, index) => {
              const fileError = validationErrors.fileItems?.[index] ?? {};

              return (
                <fieldset className="template-file" key={file.id}>
                  <legend>Archivo {index + 1}</legend>

                  <button
                    className="template-file__remove"
                    type="button"
                    onClick={() => removeFile(file.id)}
                    aria-label={`Eliminar archivo ${index + 1}`}
                  >
                    Eliminar
                  </button>

                  <div className="template-file__row">
                    <div className="template-form__field">
                      <label htmlFor={`fileName-${file.id}`}>
                        Nombre del archivo
                      </label>
                      <input
                        id={`fileName-${file.id}`}
                        type="text"
                        value={file.fileName}
                        onChange={(event) =>
                          updateFile(file.id, "fileName", event.target.value)
                        }
                        aria-invalid={Boolean(fileError.fileName)}
                        placeholder="Ej. App.jsx"
                      />
                      {fileError.fileName && (
                        <p className="template-form__error">
                          {fileError.fileName}
                        </p>
                      )}
                    </div>

                    <div className="template-form__field">
                      <label htmlFor={`type-${file.id}`}>Tipo</label>
                      <select
                        id={`type-${file.id}`}
                        value={file.type}
                        onChange={(event) =>
                          updateFile(file.id, "type", event.target.value)
                        }
                        aria-invalid={Boolean(fileError.type)}
                      >
                        {fileTypes.map((fileType) => (
                          <option value={fileType.value} key={fileType.value}>
                            {fileType.label}
                          </option>
                        ))}
                      </select>
                      {fileError.type && (
                        <p className="template-form__error">{fileError.type}</p>
                      )}
                    </div>
                  </div>

                  <div className="template-form__field">
                    <label htmlFor={`content-${file.id}`}>Contenido</label>
                    <textarea
                      id={`content-${file.id}`}
                      className="template-file__content"
                      value={file.content}
                      rows={10}
                      spellCheck="false"
                      onChange={(event) =>
                        updateFile(file.id, "content", event.target.value)
                      }
                      aria-invalid={Boolean(fileError.content)}
                      placeholder="Escribe el contenido del archivo..."
                    />
                    {fileError.content && (
                      <p className="template-form__error">
                        {fileError.content}
                      </p>
                    )}
                  </div>
                </fieldset>
              );
            })}
          </div>
        </section>

        {error && (
          <p className="template-form__submit-error" role="alert">
            {error}
          </p>
        )}

        <div className="template-form__actions">
          <button
            className="template-form__cancel-button"
            type="button"
            onClick={() =>
              navigate(isEditing ? `/templates/${initialTemplate.id}` : "/")
            }
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="template-form__submit-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Guardando..."
              : isEditing
                ? "Actualizar template"
                : "Guardar template"}
          </button>
        </div>
      </form>
    </main>
  );
}

function CreateTemplate() {
  const { create, loading, error } = useCreateTemplate();

  return (
    <TemplateForm
      submitTemplate={create}
      loading={loading}
      error={error}
    />
  );
}

export default CreateTemplate;
