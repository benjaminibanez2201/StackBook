import { useParams } from "react-router-dom";
import useGetTemplate from "../hooks/templates/useGetTemplate.js";
import useUpdateTemplate from "../hooks/templates/useUpdateTemplate.js";
import { TemplateForm } from "./CreateTemplate.jsx";

function EditTemplate() {
  const { id } = useParams();
  const {
    template,
    loading: loadingTemplate,
    error: loadError,
  } = useGetTemplate(id);
  const { update, loading: updating, error: updateError } = useUpdateTemplate();

  if (loadingTemplate) {
    return (
      <main className="create-template-page">
        <p className="template-form__submit-error" role="status">
          Cargando template...
        </p>
      </main>
    );
  }

  if (loadError || !template) {
    return (
      <main className="create-template-page">
        <p className="template-form__submit-error" role="alert">
          {loadError ?? "No se encontró el template."}
        </p>
      </main>
    );
  }

  return (
    <TemplateForm
      key={template.id}
      initialTemplate={template}
      submitTemplate={(data) => update(template.id, data)}
      loading={updating}
      error={updateError}
      isEditing
    />
  );
}

export default EditTemplate;
