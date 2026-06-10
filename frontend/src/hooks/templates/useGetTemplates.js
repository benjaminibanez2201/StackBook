import { useEffect, useState } from "react";
import { getTemplates } from "../../services/template.service.js";

function useGetTemplates({ lenguaje, categoria, subcategoria } = {}) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getTemplates({ lenguaje, categoria, subcategoria });
      setTemplates(res.data);
    } catch {
      setError("Error al cargar los templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTemplates({ lenguaje, categoria, subcategoria })
      .then((res) => setTemplates(res.data))
      .catch(() => setError("Error al cargar los templates"))
      .finally(() => setLoading(false));
  }, [lenguaje, categoria, subcategoria]);

  return { templates, loading, error, refetch };
}

export default useGetTemplates;
