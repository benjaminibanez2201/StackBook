import { useState, useEffect } from "react";
import { getTemplateById } from "../../services/template.service.js";

function useGetTemplate(id) {
  const [state, setState] = useState({
    id: null,
    template: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    getTemplateById(id)
      .then((res) => {
        if (!cancelled) {
          setState({
            id,
            template: res.data,
            error: null,
            loading: false,
          });
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setState({
            id,
            template: null,
            error:
              requestError.response?.data?.message ??
              "Error al cargar el template",
            loading: false,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return {
    template: state.id === id ? state.template : null,
    loading: state.id !== id || state.loading,
    error: state.id === id ? state.error : null,
  };
}

export default useGetTemplate;
