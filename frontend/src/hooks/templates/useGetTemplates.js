import { useEffect, useState } from "react";
import { getTemplates } from "../../services/template.service.js";

function useGetTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getTemplates();
      setTemplates(res.data);
    } catch {
      setError("Error al cargar los templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTemplates()
      .then((res) => setTemplates(res.data))
      .catch(() => setError("Error al cargar los templates"))
      .finally(() => setLoading(false));
  }, []);

  return { templates, loading, error, refetch };
}

export default useGetTemplates;
