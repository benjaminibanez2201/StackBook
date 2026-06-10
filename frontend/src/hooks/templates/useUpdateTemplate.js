import { useState } from "react";
import { updateTemplate } from "../../services/template.service.js";

function useUpdateTemplate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function update(id, data) {
    setLoading(true);
    setError(null);

    try {
      const response = await updateTemplate(id, data);
      return response.data;
    } catch {
      setError("Error al actualizar el template");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { update, loading, error };
}

export default useUpdateTemplate;
