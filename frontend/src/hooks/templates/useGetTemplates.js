import { useState, useEffect } from "react";
import { getTemplates } from "../../services/template.service.js";

function useGetTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTemplates()
      .then((res) => setTemplates(res.data))
      .catch(() => setError("Error al cargar los templates"))
      .finally(() => setLoading(false));
  }, []);

  return { templates, loading, error };
}

export default useGetTemplates;