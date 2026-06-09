import { useState, useEffect } from "react";
import { getTemplateById } from "../../services/template.service.js";

function useGetTemplate(id) {
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTemplateById(id)
      .then((res) => setTemplate(res.data))
      .catch(() => setError("Error al cargar el template"))
      .finally(() => setLoading(false));
  }, [id]);

  return { template, loading, error };
}

export default useGetTemplate;