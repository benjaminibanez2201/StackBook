import { useState } from "react";
import { createTemplate } from "../../services/template.service.js";

function useCreateTemplate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function create(data) {
    setLoading(true);
    try {
      const res = await createTemplate(data);
      return res.data;
    } catch {
      setError("Error al crear el template");
    } finally {
      setLoading(false);
    }
  }

  return { create, loading, error };
}

export default useCreateTemplate;