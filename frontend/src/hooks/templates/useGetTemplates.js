import { useEffect, useState } from "react";
import { getTemplates } from "../../services/template.service.js";

function useGetTemplates({ lenguaje, categoria } = {}) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getTemplates({ lenguaje, categoria });
      setTemplates(res.data);
    } catch {
      setError("Error al cargar los templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTemplates({ lenguaje, categoria })
      .then((res) => setTemplates(res.data))
      .catch(() => setError("Error al cargar los templates"))
      .finally(() => setLoading(false));
  }, [lenguaje, categoria]);

  return { templates, loading, error, refetch };
}

export default useGetTemplates;
